import React, { useEffect, useState,useRef } from 'react'
import Navbar from '../component/Navbar'
import { Box,Flex, HStack, Heading,Card,CardBody,SimpleGrid,VStack,Text, Button } from '@chakra-ui/react'
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const Home = () => {
    const[data, setData] = useState([]);
    
    
    const[error, setError] = useState(false);
    const[loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
      const fetchData = async (pageNo=1, limit) => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`https://kanbanbackend-2.onrender.com/todo/view`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const fetchedData = res.data.data;
          setData(fetchedData);
  
          const pendingTodos = fetchedData.filter((todo) => todo.status === 'pending');
          const inProgressTodos = fetchedData.filter((todo) => todo.status === 'progress');
          const completedTodos = fetchedData.filter((todo) => todo.status === 'complete');
  
          const initialData = [
            { id: '1', title: 'To Do', items: pendingTodos },
            { id: '2', title: 'In Progress', items: inProgressTodos },
            { id: '3', title: 'Done', items: completedTodos },
          ];
  
          setColumns(initialData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
   

  const updateStatus = async(id, currStatus) => {
    const token = localStorage.getItem('token');
    const updatedField = {status:currStatus};
    const res = await axios.patch(`https://kanbanbackend-2.onrender.com/todo/update/${id}`,updatedField, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  console.log(res,'updated');
}

const deleteHandler = async(id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.delete(`https://kanbanbackend-2.onrender.com/todo/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log('Deleted:', res.data);
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

const onDragEnd = result => {
    console.log(result);
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumnIndex = columns.findIndex(column => column.id === source.droppableId);
    const destColumnIndex = columns.findIndex(column => column.id === destination.droppableId);
    console.log(destColumnIndex,'dest');
    const currStatus = destColumnIndex == 0 ? 'pending' : destColumnIndex == 1 ? 'progress' : 'complete';

    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];

    const sourceItems = Array.from(sourceColumn.items);
    const [removed] = sourceItems.splice(source.index, 1);
    console.log(removed,'removed');
    const removedId = removed._id
    updateStatus(removedId,currStatus);
    

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      const newColumn = {
        ...sourceColumn,
        items: sourceItems
      };

      const newColumns = Array.from(columns);
      newColumns[sourceColumnIndex] = newColumn;
      setColumns(newColumns);
    } else {
      const destItems = Array.from(destColumn.items);
      destItems.splice(destination.index, 0, removed);

      const newSourceColumn = {
        ...sourceColumn,
        items: sourceItems
      };

      const newDestColumn = {
        ...destColumn,
        items: destItems
      };

      const newColumns = Array.from(columns);
      newColumns[sourceColumnIndex] = newSourceColumn;
      newColumns[destColumnIndex] = newDestColumn;

      setColumns(newColumns);

    }
  };

  const renderPaginationButtons = () => {
    const l1 = columns[0]?.items.length || 0;
    const l2 = columns[1]?.items.length || 0;
    const l3 = columns[2]?.items.length || 0;
    const tasks = Math.max(l1, l2, l3);
    const pages = Math.ceil(tasks / 3);

    return (
      <Box mt={4}>
        {Array.from({ length: pages }, (_, i) => (
          <Button key={i} m={1} onClick={() => fetchData(i+1,3)}>{i + 1}</Button>
        ))}
      </Box>
    );
  };

    
    if(loading)return <p>Loading</p>
    if(error)return <p>Error</p>
    
    return (
    <>
    <Navbar />
    <DragDropContext onDragEnd={onDragEnd}>
      <SimpleGrid columns={3} spacing={5} padding={5}>
        {columns.map((column, colIndex) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
                bg="gray.100"
                p={5}
                borderRadius="md"
                boxShadow="md"
                minHeight="400px"
                width="300px"
              >
                <Heading size="md" mb={4}>{column.title}</Heading>
               
                {column.items.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    
                    {(provided, snapshot) => (
                      <Card size="md"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        w="100%"
                        p={4}
                        bg="white"
                        borderRadius="md"
                        mb={2}
                        boxShadow={snapshot.isDragging ? 'lg' : 'md'}
                        
                      >
                    <CardBody>
                    <Text color="black">{item.task}</Text>
                     {column.id==3 ? <Button size='xs' onClick={() => deleteHandler(item._id)}>Delete</Button> : ''}
                     </CardBody>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        ))}
      </SimpleGrid>
    </DragDropContext>
    {renderPaginationButtons()}
    </>
  );
};

export default Home;

    
    
    // const generateRandomColor = () => {
    //     const r = Math.floor(Math.random() * 256);
    //     const g = Math.floor(Math.random() * 256);
    //     const b = Math.floor(Math.random() * 256);
    //     return `rgb(${r}, ${g}, ${b})`;
    // };
      

//     return (
//     <>
//     <Navbar/>
//     {loading? <p>Loading</p> : error? <p style={{color:"red"}}>Something is wrong</p> : <Box w='80vw' h='500px'  m={5} border="1px solid black" borderRadius="10px">
//       <HStack> 
//         <Box border="1px solid black" borderRadius="10px" w="33%" h="450px" m={5} overflow="hidden">
//             <Box h="15%">
//                 <Heading m={3}>To Do</Heading>
//             </Box>
//             <Box h="80%" overflow="hidden">
//                 {pendingTodos.map((todo,i) => (<Card key={i} m={3} size='md' bg={generateRandomColor()}>
//                                     <CardBody>
//                                         <Heading size='md' color="white">{todo.task}</Heading>
//                                     </CardBody>
//                                     </Card>))}
//             </Box>
//         </Box>
//         <Box border="1px solid black" borderRadius="10px"  w="33%"  h="450px" m={5} overflow="hidden">
//             <Box h="15%">
//                 <Heading m={3}>In progress</Heading>
//             </Box>
//             <Box h="80%" overflow="hidden">
//             {inProgressTodos.map((todo,i) => (<Card key={i}  m={3} size='md' bg={generateRandomColor()}>
//                                     <CardBody>
//                                         <Heading size='md' color="white">{todo.task}</Heading>
//                                     </CardBody>
//                                     </Card>))}
//             </Box>
//         </Box>
//         <Box border="1px solid black" borderRadius="10px"  w="33%"  h="450px" m={3} overflow="hidden">
//             <Box h="15%">
//             <Heading m={3}>Done</Heading>
//             </Box>
//             <Box h="80%" overflow="hidden">
//             {completedTodos.map((todo,i) => (<Card key={i}  m={2} size='md' bg={generateRandomColor()} >
//                                     <CardBody>
//                                         <Heading size='md' color="white">{todo.task}</Heading>
//                                     </CardBody>
//                                     </Card>))}
//             </Box>
//         </Box>
//       </HStack>
//     </Box>
    
//     }
//     </>
//   )
// }

// export default Home
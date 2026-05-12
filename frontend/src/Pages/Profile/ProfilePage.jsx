import React, { useState, useEffect } from 'react';
import Service from '../../utils/http';
import { Avatar, Container, Text ,Stack } from '@mantine/core';

const ProfilePage = () => {
    const service = new Service();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchUser = async () => {
        try {
            const res = await service.get("user/me");
            setUser(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }
    if(!user){
        return (
            <div>
                User not found
            </div>
        )
    }
  return (
     
    
    <Container>
        <Stack
      h={300}
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="xl"
    >   
        <Avatar src={user.avatar} alt="it's me" />
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
    </Stack>
    </Container>
  )
}

export default ProfilePage

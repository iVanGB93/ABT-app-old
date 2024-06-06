import { StyleSheet, Text, View, ActivityIndicator, RefreshControl, Platform, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import JobCard from './JobCard';
import SpentCard from '../Spents/SpentCard';
import { setJob } from '../../store/actions/jobsActions';
import { getSpents } from '../../store/actions/spentActions';

export default function JobDetail({navigation}) {
    const route = useRoute();
    const jobs = useSelector(state => state.jobs.jobs);
    const job = useSelector(state => state.jobs.job);
    const spents = useSelector(state => state.spents.spents);
    const isLoadingSpents = useSelector(state => state.spents.loading);
    const SpentMessage = useSelector(state => state.spents.message);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const color = useSelector(state => state.userData.color);
    const dispatch = useDispatch();

    const fetchJob = () => {
        let job = jobs.find(job => job.id === route.params.id)
        dispatch(setJob(job));
        setIsLoading(false);
        dispatch(getSpents(job.id));
    };

    useEffect(() => {
        fetchJob();
    }, []);

    return (
        <View style={styles.container}>
            { isLoading ? 
            <ActivityIndicator size="large" />
            :
            <JobCard navigation={navigation} id={job.id} status={job.status} client={job.client} address={job.address} description={job.description} price={job.price} inDetail={true} date={job.date} image={job.image}/>
            }
            <Text style={styles.headerText}>Spents</Text>
            { SpentMessage ? Alert.alert(SpentMessage): null}
            { isLoadingSpents ? 
                <ActivityIndicator style={styles.loading} size="large" />
                :
                <FlatList
                data={spents}
                renderItem={({ item }) => {
                    return (
                        <SpentCard 
                            id={item.id} 
                            description={item.description} 
                            amount={item.amount} 
                            price={item.price} 
                            image={item.image} 
                            date={item.date}
                            navigation={navigation}
                        />
                    );
                }}
                ItemSeparatorComponent={
                    <View
                    style={{
                        height: 16,
                    }}
                    />
                }
                ListEmptyComponent={<View><Text style={styles.headerText}>No spents found</Text></View>}
                ListHeaderComponent={<View style={{margin: 5}} />}
                ListFooterComponent={<TouchableOpacity style={[styles.button, {margin: 15, backgroundColor: color}]} onPress={() => navigation.navigate('New Spent')}><Text style={[styles.headerText, {color: 'white'}]}>Add new spent</Text></TouchableOpacity>}
                refreshControl={
                    <RefreshControl
                      refreshing={isLoading}
                      onRefresh={() => fetchJob()}
                      colors={[color]} // Colores del indicador de carga
                      tintColor={color} // Color del indicador de carga en iOS
                    />}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: "center",
        marginTop: 5,
    },
    loading: {
        flex: 1,
        verticalAlign: 'middle'
    },
    button: {
        padding: 10,
        borderRadius: 16,
        margin: 5,
        ...Platform.select({
            ios: {
            shadowOffset: { width: 2, height: 2 },
            shadowColor: "#333",
            shadowOpacity: 0.3,
            shadowRadius: 4,
            },
            android: {
            elevation: 5,
            },
        }),
    },
});
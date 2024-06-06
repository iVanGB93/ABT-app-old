import { StyleSheet, View, ActivityIndicator, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClientCard from './ClientCard.js';
import JobCard from '../Jobs/JobCard.js';
import { getJobs } from '../../store/actions/jobsActions.js';


export default function ClientDetail({navigation}) {
    const {color, userName} = useSelector(state => state.userData);
    const {client, error, loading} = useSelector(state => state.clients);
    const [jobs, setJobs] = useState([]);
    const stateJobs = useSelector(state => state.jobs.jobs);
    const isJobsUpdated = useSelector(state => state.jobs.updated);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const errorJobs = useSelector(state => state.jobs.error);
    const dispatch = useDispatch()

    const fetchJobs = () => {
        if (!isJobsUpdated) {
            dispatch(getJobs(userName));
        };
        let jobs = stateJobs.filter(stateJobs => stateJobs.client === client.user)
        setJobs(jobs);
        setIsLoadingJobs(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
            { loading ? 
            <ActivityIndicator style={styles.loading} size="large" />
            :
            <ClientCard id={client.id} navigation={navigation} image={client.image} name={client.user} address={client.address} phone={client.phone} email={client.email}  inDetail={true}/>
            }
            <Text style={styles.headerText}>Jobs</Text>
            { isLoadingJobs ?
                <ActivityIndicator style={styles.loading} size="large" />
                :
                <FlatList
                data={jobs}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate('JobStack', {screen: 'Job Details', params: {client: item.client, id: item.id}})}>
                            <JobCard navigation={navigation} id={item.id} status={item.status} client={item.client} address={item.address} description={item.description} price={item.price} inDetail={false} />
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={
                    <View
                    style={{
                        height: 16,
                    }}
                    />
                }
                ListEmptyComponent={
                    <View>
                        <Text style={styles.headerText}>No jobs found</Text>
                    </View>
                }
                ListHeaderComponent={<View style={{margin: 5}} />}
                ListFooterComponent={<TouchableOpacity style={[styles.button, {margin: 15, backgroundColor: color}]} onPress={() => navigation.navigate('JobStack', {screen: 'New Job'})}><Text style={[styles.headerText, {color: 'white'}]}>Add new Job</Text></TouchableOpacity>}
                refreshControl={
                    <RefreshControl
                      refreshing={isLoadingJobs}
                      onRefresh={() => fetchJobs()}
                      colors={[color]} // Colores del indicador de carga
                      tintColor={color} // Color del indicador de carga en iOS
                    />}
                />
            }
            {errorJobs ? (
                <Text style={styles.errorText}>{errorJobs}</Text>
            ) : null}
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
        backgroundColor: '#694fad',
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
    errorText: {
        color: "red",
        marginBottom: 5,
    },
});
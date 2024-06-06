import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import JobCard from './JobCard';
import { getJobs, changeLoading } from '../../store/actions/jobsActions';


export default function Jobs({navigation}) {
    const {jobs, loading, error} = useSelector(state => state.jobs)
    const {color, userName} = useSelector(state => state.userData);

    const dispatch = useDispatch()

    const fetchJobs = () => {
        if (jobs.length !== 0) {
            console.log("SAME JOBS");
            dispatch(changeLoading(false));
        } else {
            dispatch(getJobs(userName));
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            { loading ? 
            <ActivityIndicator size="large" />
            :
            <FlatList
            data={jobs}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity onPress={() => navigation.navigate('Job Details', {client: item.client, id: item.id})}>
                        <JobCard image={item.image} id={item.id} navigation={navigation} status={item.status} client={item.client} address={item.address} description={item.description} price={item.price} inDetail={true} date={item.date} isList={true} />
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
            ListEmptyComponent={<Text style={styles.loading}>{ error ? error.toString() + ", pull to refresh" : "No jobs found"}</Text>}
            ListHeaderComponent={<View style={{margin: 5}} />}
            ListFooterComponent={<View style={{margin: 5}} />}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => dispatch(getJobs(userName))}
                    colors={[color]} // Colores del indicador de carga
                    tintColor={color} // Color del indicador de carga en iOS
                />}
            />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flex: 1,
        verticalAlign: 'middle',
        alignSelf: 'center',
    },
});
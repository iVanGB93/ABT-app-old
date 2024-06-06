import { StyleSheet, View, ActivityIndicator, Text, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ItemCard from './ItemCard';
import JobCard from '../Jobs/JobCard';
import { getUsedItems } from '../../store/actions/itemActions';

export default function ItemDetail({navigation}) {
    const item = useSelector(state => state.items.item);
    const usedItems = useSelector(state => state.items.usedItems);
    const error = useSelector(state => state.items.error);
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingUsedItems = useSelector(state => state.items.loading);
    const errorJobs = useSelector(state => state.jobs.error);
    const color = useSelector(state => state.userData.color);
    const dispatch = useDispatch()

    const fetchUsedItems = () => {
        dispatch(getUsedItems(item.id));
    };

    useEffect(() => {
        fetchUsedItems();
    }, []);

    return (
        <View style={styles.container}>
            { isLoading ? 
            <ActivityIndicator style={styles.loading} size="large" />
            :
            <ItemCard id={item.id} navigation={navigation} name={item.name} image={item.image} description={item.description} price={item.price} inDetail={true} amount={item.amount}/>
            }
            <Text style={styles.headerText}>Used in</Text>
            { isLoadingUsedItems ? 
                <ActivityIndicator style={styles.loading} size="large" />
                :
                <FlatList
                data={usedItems}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate('JobStack', {screen: 'Job Details', params: {client: item.client, id: item.id}})}>
                            <JobCard id={item.id} status={item.status} image={item.image} client={item.client} address={item.address} description={item.description} price={item.price} inDetail={true} />
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
                        <Text style={styles.headerText}>No used yet</Text>
                        
                    </View>
                }
                ListHeaderComponent={<View style={{margin: 5}} />}
                ListFooterComponent={<TouchableOpacity style={{margin: 5}} />}
                refreshControl={
                    <RefreshControl
                      refreshing={isLoadingUsedItems}
                      onRefresh={() => fetchUsedItems()}
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
      padding: 10,
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
    }
});
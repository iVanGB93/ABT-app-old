import { StyleSheet, Text, View, RefreshControl, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

import ItemCard from './ItemCard.js';
import { useDispatch, useSelector } from 'react-redux';
import { getItems, changeLoading, setItem } from '../../store/actions/itemActions.js';


export default function Items({navigation}) {
    const {items, loading, error} = useSelector(state => state.items);
    const {color, userName} = useSelector(state => state.userData);

    const dispatch = useDispatch()

    const fetchItems = () => {
        if (items.length !== 0) {
            console.log("SAME ITEMS");
            dispatch(changeLoading(false));
        } else {
            dispatch(getItems(userName));
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handlePressable = (id) => {
        let item = items.find(item => item.id === id);
        dispatch(setItem(item));
        navigation.navigate('Item Details');
    };

    return (
        <SafeAreaView style={styles.container}>
            { loading ? 
            <ActivityIndicator style={styles.loading} size="large" />
            :
            <FlatList
            data={items}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity onPress={() => handlePressable(item.id)}>
                        <ItemCard id={item.id} navigation={navigation} name={item.name} amount={item.amount} image={item.image} date={item.date} description={item.description} price={item.price}/>
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
            ListEmptyComponent={<Text style={styles.loading}>{ error ? error.toString() + ", pull to refresh" : "No items found"}</Text>}
            ListHeaderComponent={<View style={{margin: 5}} />}
            ListFooterComponent={<View style={{margin: 5}} />}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => dispatch(getItems(userName))}
                    colors={[color]} // Colores del indicador de carga
                    tintColor={color} // Color del indicador de carga en iOS
                />}
            />
            }
        </SafeAreaView>
    )
};

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
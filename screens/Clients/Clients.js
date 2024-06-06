import { StyleSheet, Text, View, RefreshControl, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

import ClientCard from './ClientCard.js';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, setClient, changeLoading } from '../../store/actions/clientsActions.js';
import { darkMainColor, lightMainColor } from '../../settings';

export default function Clients({navigation}) {
    const {color, userName, darkTheme} = useSelector(state => state.userData)
    const {clients, loading, error} = useSelector(state => state.clients);
    const dispatch = useDispatch();

    const fetchClients = () => {
        if (clients.length !== 0) {
            console.log("SAME CLIENTS");
        } else {
            dispatch(getClients(userName));
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handlePressable = (id) => {
        let client = clients.find(client => client.id === id);
        dispatch(setClient(client));
        navigation.navigate('Client Details');
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor:darkTheme ? darkMainColor: lightMainColor}]}>
            { loading ? 
            <ActivityIndicator color={color} size="large" />
            :
            <FlatList
            data={clients}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity onPress={() => handlePressable(item.id)}>
                        <ClientCard id={item.id} navigation={navigation} name={item.user} address={item.address} phone={item.phone} email={item.email} image={item.image}/>
                    </TouchableOpacity>
                );
            }}
            ItemSeparatorComponent={<View style={{ height: 16}}/>}
            ListEmptyComponent={<Text style={styles.loading}>{ error ? error.toString() + ", pull to refresh" : "No clients found"}</Text>}
            ListHeaderComponent={<View style={{margin: 5}} />}
            ListFooterComponent={<View style={{margin: 5}} />}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => dispatch(getClients(userName))}
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
    },
    loading: {
        flex: 1,
        verticalAlign: 'middle',
        alignSelf: 'center',
        fontSize: 18,
    },
});
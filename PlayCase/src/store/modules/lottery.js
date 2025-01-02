import axios from 'axios';

export default {
    namespaced: true,
    actions: {
        async registerInLottery(_, userData) {
            try {
                const response = await axios.post('/v1/game/current/registerInLottery', userData);
                return response.data;
            } catch (error) {
                if (error.response && error.response.data) {
                    throw new Error(error.response.data.message || 'Ошибка при регистрации');
                }
                throw new Error('Ошибка при соединении с сервером');
            }
        },
    },
};
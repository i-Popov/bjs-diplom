'use strict'

const logout = new LogoutButton();

logout.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const rates = new RatesBoard();

function rateBoards (rate) {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            rate.clearTable();
            rate.fillTable(response.data);
        }
    });
}

rateBoards(rates);
setInterval(rateBoards, 5000, rates);

const money = new MoneyManager();

money.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        money.setMessage(response.success, response.success ? 'Денежные средства успешно поступили на счет' : response.error);
    });
}

money.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        money.setMessage(response.success, response.success ? 'Конвертация валюты прошла успешно' : response.error);
    });
}

money.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        money.setMessage(response.success, response.success ? 'Перевод выполнен успешно' : response.error);
    });
}

const favorite = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        money.updateUsersList(response.data);
    }
});

favorite.addUserCallback = (data) => {
    const parsedData = {
        id: parseInt(data.id),
        name: data.name,
    };
    ApiConnector.addUserToFavorites(parsedData, (response) => {
        if (response.success) {
            favorite.clearTable();
            favorite.fillTable(response.data);
            money.updateUsersList(response.data);
            favorite.setMessage(true, "Пользователь успешно добавлен!");
        } else favorite.setMessage(false, response.error);
    });
};

favorite.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            favorite.clearTable();
            favorite.fillTable(response.data);
            money.updateUsersList(response.data);
            favorite.setMessage(true, "Пользователь успешно удален!");
        } else favorite.setMessage(false, response.error);
    });
};

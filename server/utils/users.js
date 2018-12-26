class Users {
    constructor () {
        this.users = [];
    }

    addUser(id, name , room) {
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }

    removeUser (id) {
        let removedUser;
        this.users = this.users.filter((user) =>{
            if (user.id !== id) {
                return true;
            }
            else {
                removedUser = user;
                return false;
            }
        } );
        return removedUser;
    }

    getUser (id){
        return this.users.find( (user) => user.id === id);
    }

    getUserList (room){
        return this.users.filter((user) => user.room === room );
    }

    getUserNameList (room) {
        return this.getUserList(room).map((user) => user.name);
    }

    getUserByName (name){
        return this.users.find((user) => user.name === name);
    }

}

module.exports = {
    Users
};
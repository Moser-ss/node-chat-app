const { expect } = require('chai');
const { Users } = require('../../server/utils/users');

describe('Users', () => {
    let users ;

    beforeEach(() => {
        users = new Users();
        users.users = require('./_data/users.json');    
    });

    it('should add a new user', () => {
        users = new Users();
        const user = {
            id: '4bnGtHKVDx',
            name: 'Alice',
            room: 'earth'
        };

        const resUser = users.addUser(user.id,user.name , user.room);
        expect(users.users).to.deep.equal([resUser]);
    });

    it('should remove a user', () => {
        const userToRemove = users.users[0];
        const intialUserNumber = users.users.length;
        const userRemoved = users.removeUser(userToRemove.id);
        expect(userRemoved).to.be.deep.equals(userToRemove);
        expect(users.users.length).to.be.equal(intialUserNumber -1 );
        expect(users.users).to.not.include(userToRemove);
    });

    it('should not remove user', () => {
        const intialUserNumber = users.users.length;
        const userRemoved = users.removeUser('notValid');
        expect(userRemoved).to.be.an('undefined');
        expect(users.users.length).to.be.equal(intialUserNumber);
    });
    
    it('should find user', () => {
        const userToFind = users.users[0];
        const user = users.getUser(userToFind.id);
        expect(user).to.be.deep.equal(user);
    });

    it('should not find user', () => {
        const user = users.getUser('notValid');
        expect(user).to.be.an('undefined');
    });

    it('should return a list of users in room invention', () => {
        const usersList = users.getUserList('invention');
        expect(usersList).to.be.deep.equal([users.users[0], users.users[2]]);
    });

    it('should return list of names in the room invention', () => {
        const usersList = users.getUserNameList('invention');
        expect(usersList).to.be.deep.equal(['Alice','Charlie']);
    });

    it('should return a empty list of users', () => {
        const usersList = users.getUserList('banana');
        expect(usersList).to.be.deep.equals([]);
    });

    it('should return a empty list of user names', () => {
        const usersList = users.getUserNameList('ananas');
        expect(usersList).to.be.deep.equals([]);
    });

    it('should find user by name', () => {
        const userToFind = users.users[0];
        const user = users.getUserByName(userToFind.name);
        expect(user).to.be.deep.equal(user);
    });

    it('should not find user by name', () => {
        const user = users.getUserByName('notValid');
        expect(user).to.be.an('undefined');
    });

    it('should return a list of rooms without duplicates', () => {
        const rooms = users.getRooms();
        expect(rooms).to.be.deep.equals(['invention','horse']);
    });
});
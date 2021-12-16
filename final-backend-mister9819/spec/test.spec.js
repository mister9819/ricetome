/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
let article_id;

describe('Validate functionality', () => {

    it('register new user', (done) => {
        let regUser = {username: 'testUser', password: '123', "dob":"01-01-2000", "email": "aa@a.com", "zipcode": "11111"};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('login user', (done) => {
        let loginUser = {username: 'testUser', password: '123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('should add new article with successive article id, return list of articles with new article', (done) => {
        // add a new article
        // verify you get the articles back with new article
        // verify the id, author, content of the new article
        let post = {title: 'Test article', text: 'A new test article'};
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            if (res['articles'] instanceof Array) {
                let id = res['articles'].length - 1;
                newPost = res['articles'][id];
                article_id = newPost._id;
                expect(newPost.author).toBe("testUser");
                expect(newPost.text).toBe('A new test article');
            }
            done();
        })
    });

    it('should get article with article id', (done) => {
        // verify you get the article back with article id
        fetch(url('/articles/' + article_id), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            newPost = res['articles'];
            article_id = newPost.id;
            expect(newPost.author).toBe("testUser");
            expect(newPost.text).toBe('A new test article');
            done();
        })
    });

    it('should get articles', (done) => {
        // verify you get the articles
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            if (res instanceof Array) {
                expect(res.length).toBeGreaterThan(0);
            }
            done();
        })
    });

    it('update headline', (done) => {
        let headline = {headline: 'new headline'};
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify(headline)
        }).then(res => res.json()).then(res => {
            expect(res.headline).toEqual('new headline');
            done();
        });
    });

    it('should get headline for logged in user', (done) => {
        // verify you get the headline for the testUser
        fetch(url('/headline/testUser'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        }).then(res => res.json()).then(res => {
            expect(res.headline).toBe("new headline")
            done();
        })
    });

    it('logout', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie}
        }).then(res => {
            expect(res.statusText).toEqual('OK');
            done();
        });
    });


});
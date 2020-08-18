require('dotenv').config()
const request = require('request');

describe('calc', () => {
    it('should multiple 2 and 2', () => {
        expect(2*2).toBe(4)
    })
})

describe("get messages", () => {
    it("should be return 200 ok", (done) => {
        request.get(`http://localhost:${process.env.PORT}/messages`, (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it("should return a list, that not empty", (done) => {
        request.get(`http://localhost:${process.env.PORT}/messages`, (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done()
        })
    })
})

describe("get message from user", () => {
    it("should be return 200 ok", (done) => {
        request.get(`http://localhost:${process.env.PORT}/messages/Andy`, (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it("user name shoud be Andy", (done) => {
        request.get(`http://localhost:${process.env.PORT}/messages/Andy`, (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual("Andy")
            done()
        })
    })
})

const NewsRepository = require('../models/NewsRepository');
module.exports = 
class NewsController extends require('./Controller') {
    constructor(req, res, params){
        super(req, res, params,  false /* needAuthorization */);
        this.NewsRepository = new NewsRepository(req);
    }

    head() {
        this.response.JSON(null, this.NewsRepository.ETag);
    }
    get(id){
        // if we have no parameter, expose the list of possible query strings
        if (this.params === null) { 
            if(!isNaN(id)) {
                this.response.JSON(this.NewsRepository.get(id));
            }
            else  
                this.response.JSON( this.NewsRepository.getAll(), 
                                    this.NewsRepository.ETag);
        }
        else {
            if (Object.keys(this.params).length === 0) /* ? only */{
                this.queryStringHelp();
            } else {
                this.response.JSON(this.NewsRepository.getAll(this.params), this.NewsRepository.ETag);
            }
        }
    }
    post(New){  
        if (this.requestActionAuthorized()) {
            let newNew = this.NewsRepository.add(New);
            if (newNew)
                this.response.created(newNew);
            else
                this.response.unprocessable();
        } else 
            this.response.unAuthorized();
    }
    put(New){
        if (this.requestActionAuthorized()) {
            if (this.NewsRepository.update(New))
                this.response.ok();
            else
                this.response.unprocessable();
        } else
            this.response.unAuthorized();
    }
    remove(id){
        if (this.requestActionAuthorized()) {
            if (this.NewsRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        } else
            this.response.unAuthorized();
    }
}
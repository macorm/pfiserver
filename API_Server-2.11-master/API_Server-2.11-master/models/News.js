module.exports = 
class Image{
    constructor(title, Texte, created, userId, GUID)
    {
        this.Id = 0;
        this.Title = title !== undefined ? title : "";
        this.Texte = Texte !== undefined ? Texte : "";
        this.Created = created !== undefined ? created : 0;
        this.UserId = userId !== undefined ? userId : 0;
        this.GUID = GUID !== undefined ? GUID : "";
    }

    static valid(instance) {
        const Validator = new require('./validator');
        let validator = new Validator();
        validator.addField('Id','integer');
        validator.addField('Title','string');
        validator.addField('Texte','string');
        validator.addField('UserId', 'integer');
        validator.addField('Created','integer');
        return validator.test(instance);
    }
}
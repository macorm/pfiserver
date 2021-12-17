const Repository = require('./repository');
const ImagesFilesRepository = require('./imageFilesRepository.js');
const Nouvelles = require('./News.js');
const utilities = require("../utilities");
module.exports = 
class NouvellesRepository extends Repository {
    constructor(req){
        super('Nouvelle', true);
        this.users = new Repository('Users');
        this.req = req;
        this.setBindExtraDataMethod(this.bindUsernameAndNouvelleURL);
    }
    bindUsernameAndNouvelleURL(Nouvelle){
        if (Nouvelle) {
            let user = this.users.get(Nouvelle.UserId);
            let username = "unknown";
            if (user !== null)
                username = user.Name;
            let bindedNouvelle = {...Nouvelle};
            bindedNouvelle["Username"] = username;
            bindedNouvelle["Date"] = utilities.secondsToDateString(Nouvelle["Created"]);
            if (Nouvelle["GUID"] != ""){
                bindedNouvelle["OriginalURL"] = "http://" + this.req.headers["host"] + ImagesFilesRepository.getImageFileURL(Nouvelle["GUID"]);
                bindedNouvelle["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImagesFilesRepository.getThumbnailFileURL(Nouvelle["GUID"]);
            } else {
                bindedNouvelle["OriginalURL"] = "";
                bindedNouvelle["ThumbnailURL"] = "";
            }
            return bindedNouvelle;
        }
        return null;
    }
    add(Nouvelle) {
        Nouvelle["Created"] = utilities.nowInSeconds();
        if (Nouvelles.valid(Nouvelle)) {
            Nouvelle["GUID"] = ImagesFilesRepository.storeImageData("", Nouvelle["ImageData"]);
            delete Nouvelle["NouvelleData"];
            return super.add(Nouvelle);
        }
        return null;
    }
    update(Nouvelle) {
        Nouvelle["Created"] = utilities.nowInSeconds();
        if (Nouvelles.valid(Nouvelle)) {
            let foundNouvelle = super.get(Nouvelle.Id);
            if (foundNouvelle != null) {
                Nouvelle["GUID"] = ImagesFilesRepository.storeImageData(Nouvelle["GUID"], Nouvelle["ImageData"]);
                delete Nouvelle["NouvelleData"];
                return super.update(Nouvelle);
            }
        }
        return false;
    }
    remove(id){
        let foundNouvelle = super.get(id);
        if (foundNouvelle) {
            ImagesFilesRepository.removeImageFile(foundNouvelle["GUID"]);
            return super.remove(id);
        }
        return false;
    }
}
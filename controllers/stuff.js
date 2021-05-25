const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = req.body.thing;
    const thing = new Thing({
      ...JSON.parse(req.body.sauce),
      likes: 0,
      dislikes: 0,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.modifyThing = (req, res, next) => {

  Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        if (req.file != null) fs.unlink(`images/${filename}`, () => {});
        
        const thingObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

        Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
      })  
      .catch(error => res.status(500).json({ error }));
  };



exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getAllStuff = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyLikeThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
      .then(thing => {
        let arrayLike = new Array();
        let arrayDislike = new Array();
        for (let i = 0; i < thing.usersLiked.length; i++) {
          if (thing.usersLiked[i] != req.body.userId) {
            arrayLike[arrayLike.length] = thing.usersLiked[i];
          }
        };

        for (let i = 0; i < thing.usersDisliked.length; i++) {

          if (thing.usersDisliked[i] != req.body.userId) {
            arrayDislike[arrayDislike.length] = thing.usersDisliked[i];
          }
        };
        
        if (req.body.like > 0) {
          arrayLike[arrayLike.length] = req.body.userId;
        }
        if (req.body.like < 0) {
          arrayDislike[arrayDislike.length] = req.body.userId;
        }

        // console.log("nb like = "+ arrayLike.length);
        // console.log("nb dislike = "+ arrayDislike.length);
        const thingObject = 
        {
          likes: arrayLike.length,
          dislikes: arrayDislike.length,
          usersDisliked : arrayDislike,
          usersLiked: arrayLike,
        };

        Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
       
      })
      .catch(error => res.status(500).json({ error }));

};
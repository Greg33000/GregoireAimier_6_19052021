const Sauce = require('../models/Sauce');
const fs = require('fs');
var sanitize = require('mongo-sanitize');

exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    ...JSON.parse(req.body.sauce),
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      if (req.file != null) fs.unlink(`images/${filename}`, () => {});
      const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
    })  
    .catch(error => res.status(500).json({ error }));
};



exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyLikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        let arrayLike = new Array();
        let arrayDislike = new Array();
        for (let i = 0; i < sauce.usersLiked.length; i++) {
          if (sauce.usersLiked[i] != req.body.userId) {
            arrayLike[arrayLike.length] = sauce.usersLiked[i];
          }
        };
        for (let i = 0; i < sauce.usersDisliked.length; i++) {
          if (sauce.usersDisliked[i] != req.body.userId) {
            arrayDislike[arrayDislike.length] = sauce.usersDisliked[i];
          }
        };
        if (req.body.like > 0) {
          arrayLike[arrayLike.length] = req.body.userId;
        }
        if (req.body.like < 0) {
          arrayDislike[arrayDislike.length] = req.body.userId;
        }
        const sauceObject = 
        {
          likes: arrayLike.length,
          dislikes: arrayDislike.length,
          usersDisliked : arrayDislike,
          usersLiked: arrayLike,
        };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};
const Sauces = require('../models/sauces');

// CREER SAUCE
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceData = JSON.parse(req.body.sauce);
    const sauce = new Sauces({
        userId:sauceData.userId,
        name:sauceData.name,
        manufacturer:sauceData.manufacturer,
        description:sauceData.description,
        mainPepper:sauceData.mainPepper,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat:sauceData.heat,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[],
    });
    sauce.save()
    .then(() => res.status(201).json({ sauce:sauce, message: 'sauce créée' }))
    .catch(error => res.status(400).json({ error }));
};

// MODIFIER SAUCE

exports.updateSauce = (req, res, next) => {
    const sauce = req.file ? // utilisateur upload un fichier lors de la modif ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // prend info dans le body (image non inclu)

    Sauces.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Modified!'}))
      .catch(error => res.status(400).json({ error }));
    };


// SUPPRIMER SAUCE
exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Deleted!'}))
      .catch(error => res.status(400).json({ error }));
  };

// AFFICHER 1 SAUCE
exports.getSpecificSauce = (req, res, next) => {
    Sauces.findOne({_id:req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// AFFICHER SAUCES
exports.getSauce = (req, res, next) => {
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  };

// LIKES SYSTEM
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauces.findOne({_id:sauceId})
    
    .then(sauce => {
        const nbrLikes = {
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
            likes : 0,
            dislikes : 0
        }

        // remise a 0
        if(nbrLikes.usersLiked.includes(userId)){
            const index = nbrLikes.usersLiked.indexOf(userId);
            nbrLikes.usersLiked.splice(index, 1);
        }
        if(nbrLikes.usersDisliked.includes(userId)){
            const index = nbrLikes.usersDisliked.indexOf(userId);
            nbrLikes.usersDisliked.splice(index, 1);
        }

        switch (like){
            case 1:
                nbrLikes.usersLiked.push(userId);
                break;
            
            case -1:
                nbrLikes.usersDisliked.push(userId);
                break;

            case 0:
            // remise a 0 faite par default
                break
        };
        // TOTAL LIKE/DISLIKE
        nbrLikes.likes = nbrLikes.usersLiked.length;
        nbrLikes.dislikes = nbrLikes.usersDisliked.length;
        console.log(nbrLikes);
        // CALCUL VALEUR FINALE
        Sauces.updateOne({_id:sauceId}, nbrLikes)
            .then(() => res.status(200).json({message: 'la notation à été prise en compte'}))
            .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error:error.message}));
}



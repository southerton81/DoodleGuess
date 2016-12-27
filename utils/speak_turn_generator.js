var HttpUtils = require('./../utils/http_utils');

var vocabulary = ["area",
    "book",
    "business",
    "case",
    "child",
    "company",
    "country",
    "day",
    "eye",
    "fact",
    "family",
    "group",
    "hand",
    "home",
    "life",
    "lot",
    "man",
    "money",
    "month",
    "mother",
    "night",
    "number",
    "part",
    "people",
    "place",
    "point",
    "problem",
    "program",
    "question",
    "right",
    "room",
    "school",
    "state",
    "story",
    "student",
    "study",
    "system",
    "thing",
    "time",
    "water",
    "way",
    "week",
    "word",
    "work",
    "world",
    "year"];

var SpeakTurnGenerator = {}

SpeakTurnGenerator.generateSpeakTurn = function () {
    var index = vocabulary.length * Math.random();
    index = Math.round(index);
    var request = "https://api.flickr.com/services/feeds/photos_public.gne?tags=" + vocabulary[index] + "&format=json&nojsoncallback=1";

    console.log(vocabulary[index]);
    return HttpUtils.get(request, function (body) {
        body = body.replace(/\\'/g, "'");
        var feed = JSON.parse(body);
        var indexesSet = new Set();
        const maxImages = 5;

        if (feed.items.length > 0) {
            if (feed.items.length < maxImages) {
                indexesSet.add(Array.from(Array(feed.items.length - 1).keys()))
            } else {
                while (indexesSet.size < maxImages)
                    indexesSet.add(Math.round(Math.random() * (feed.items.length - 1)));
            }

            var setValues = indexesSet.values();
            let index = setValues.next();

            if (index.done)
               throw new Error();

            var selectedImage = feed.items[index.value].media.m;

            index = setValues.next()
            var additionalImages = [];
            while (!index.done) {
                additionalImages.push(feed.items[index.value].media.m);
                index = setValues.next();
            }
            return { selectedImage, additionalImages };
        }
    });
}

module.exports = SpeakTurnGenerator;
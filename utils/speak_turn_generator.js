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
    const maxImages = 5;
    var request = "https://api.flickr.com/services/feeds/photos_public.gne?tags=" + vocabulary[index] + "&format=json&nojsoncallback=1";
    return HttpUtils.get(request, function(body) {
        try {
            body = body.replace(/\\'/g, "'");
            var feed = JSON.parse(body);
            var indexesSet = new Set();

            if (feed.items.length > 0) {
                if (feed.items.length < maxImages) {
                    indexesSet.add(Array.from(Array(feed.items.length).keys()))
                } else {
                    while (indexesSet.size < maxImages)
                        indexesSet.add(Math.round(Math.random() * feed.items.length));
                }

                var setValues = indexesSet.values();
                var selectedImage = feed.items[setValues.next().value].media.m;
            }
        } catch (err) {
            console.log(err.toString());
            return {};
        }

        return {

        };
    });
}

module.exports = SpeakTurnGenerator;
var DataExamples;
(function (DataExamples) {
    DataExamples.chapterToLI = function (chapter, i) {
        return DOM.LI({
            text: chapter.name,
            dataContext: chapter,
            selectSettings: {
                selectSet: function (elx, newVal) {
                    var chp = elx.bindInfo.dataContext;
                    chp.selected = true;
                }
            }
        });
    };
    DataExamples.bookToLI = function (book, i) {
        var li = DOM.LI({
            text: book.title,
            kids: [
                DOM.UL({
                    collapsed: true,
                    toggleKidsOnParentClick: true,
                    kids: book.chapters.map(DataExamples.chapterToLI)
                })
            ]
        });
        return li;
    };
    DataExamples.bookGen = function (el) {
        var bI = el.bindInfo;
        var subject = bI.dataContext;
        return subject.books.map(DataExamples.bookToLIDyn);
    };
    DataExamples.chapterGen = function (el) {
        var bI = el.bindInfo;
        var book = bI.dataContext;
        return book.chapters.map(DataExamples.chapterToLI);
    };
    DataExamples.bookToLIDyn = function (book, i) {
        var li = DOM.LI({
            text: book.title,
            kids: [
                DOM.UL({
                    dataContext: book,
                    collapsed: true,
                    toggleKidsOnParentClick: true,
                    kidsGet: DataExamples.chapterGen
                })
            ]
        });
        return li;
    };
    function GenerateBooks(noOfBooks, noOfChapters) {
        var json = {
            subject: "JavaScript",
            books: []
        };
        for(var i = 0; i < noOfBooks; i++) {
            var book = {
                title: " book " + i,
                chapters: []
            };
            json.books.push(book);
            for(var j = 0; j < noOfChapters; j++) {
                var chapter = {
                    name: 'chapter ' + j
                };
                book.chapters.push(chapter);
            }
        }
        return json;
    }
    DataExamples.GenerateBooks = GenerateBooks;
})(DataExamples || (DataExamples = {}));
//@ sourceMappingURL=Books.js.map

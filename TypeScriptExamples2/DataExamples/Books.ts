///<reference path="..\Element.ts" />


module DataExamples {
    export interface IChapter {
        name: string;
    }

    export interface IBook {
        title: string;
        chapters: IChapter[];
    }

    export interface ISubject {
        subject: string;
        books: IBook[];
    }

    export var chapterToLI:  (chapter : IChapter, i : number) => DOM.ElX = (chapter, i) => {
        return DOM.LI({ text: chapter.name });
    };

     

    export var bookToLI: (book: DataExamples.IBook, i: number) => DOM.ElX = (book, i) => {
        var li = DOM.LI({
            //collapsed:true,
            //toggleKidsOnParentClick:true,
            text: book.title,
            kids: [DOM.UL({
                collapsed:true,
                toggleKidsOnParentClick:true,
                kids: book.chapters.map(DataExamples.chapterToLI),
            })]
        });
        return li;
    };

    export var bookGen : (el: DOM.ElX) => DOM.ElX[] = (el) => {
        var bI = el.bindInfo;
        var subject = <DataExamples.ISubject>bI.dataContext;
        return subject.books.map(DataExamples.bookToLIDyn);
    };

    export var chapterGen: (el: DOM.ElX) => DOM.ElX[] = el => {
        var bI = el.bindInfo;
        var book = <IBook> bI.dataContext;
        return book.chapters.map(chapterToLI);
    };

    export var bookToLIDyn: (book: DataExamples.IBook, i: number) => DOM.ElX = (book, i) => {
        var li = DOM.LI({
            text: book.title,
            kids: [DOM.UL({
                dataContext:book,
                collapsed:true,
                toggleKidsOnParentClick:true,
                kidsGet: chapterGen,
            })]
        });
        return li;
    };

    export function GenerateBooks(noOfBooks: number, noOfChapters: number) : ISubject {
        var json: ISubject = {
            subject: "JavaScript", books: [],
        };
        for (var i = 0; i < noOfBooks; i++) {
            var book: IBook = {
                title: " book " + i, chapters: [],
            };
            json.books.push(book);
            for (var j = 0; j < noOfChapters; j++) {
                var chapter: IChapter = {
                    name: 'chapter ' + j,
                };
                book.chapters.push(chapter);
            }
        }
        return json;
    }
}
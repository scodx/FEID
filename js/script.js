
var app = {
    init: function () {

        var currentDate = this.currentDate;

        this.fillDateSelects();

        $("#day").val(currentDate.getUTCDate());
        $("#month").val(currentDate.getUTCMonth() + 1);
        $("#year").val(currentDate.getUTCFullYear());

    },
    publications: {
        tabascohoy: {
            data: {},
            minPages: 50,
            maxPages: 75
        },
        criollo: {
            data: {},
            minPages: 28,
            maxPages: 45
        },
        basta: {
            data: {},
            minPages: 35,
            maxPages: 45
        },
        campeche: {
            data: {},
            minPages: 28,
            maxPages: 45
        }
    },
    currentDate: new Date(),
    pages: [],
    stopSearching: false,
    fillDateSelects: function () {

        var currentDate = this.currentDate,
            currentYear = currentDate.getUTCFullYear();

        var processOptions = function (start, finish) {
            var result = [];
            for (d = start; d <= finish; d++) {
                result.push("<option value='" + d + "'>" + d + "</option>");
            }
            return result.join("");
        };

        $("#day").html(processOptions(1, 31));
        $("#month").html(processOptions(1, 12));
        $("#year").html(processOptions(2010, currentYear));


    },
    getPublication: function (publication, day, month, year) {

        //The newspaper library starts from Oct 1 2010

        this.processPages(publication, day, month, year);

        this.renderPages();

    },
    processPages: function (publication, day, month, year) {

        var publicationData = this.publications[publication];

        app.pages = [];
        app.stopSearching = false;

        for (p = 1; p <= publicationData.maxPages; p++) {

            if(this.stopSearching === false){

                var pageURL = this.buildPageURL(this.buildIntString(p), publication, year, month, day);

                if(p >= publicationData.minPages){
                    this.imageExist(
                        pageURL,
                        function(){
                            app.pages.push(pageURL);
                        },
                        function(){
                            app.stopSearching = true;
                        }
                    );
                }else{
                    this.pages.push(pageURL)
                }

            }

        }

        return this.pages;

    },
    imageExist: function (url, callbackSuccess, callbackError) {
        $.ajax({
            url: url,
            type:'HEAD',
            async: false,
            error: callbackError,
            success: callbackSuccess
        });
    },
    buildPageURL: function(page, publicationName, year, month, day){

        var baseURL = "http://www.eid.com.mx/edicionimpresa/" +
            year + "/" + month + "/" + day + "/" +
            publicationName + "/seguro/files/assets/mobile/pages/page00";

        return baseURL + page + "_i1.jpg";

    },
    buildIntString: function (i) {
        return (i < 10) ? "0" + i.toString() : i.toString();
    },
    renderPages: function(){
        //publication-content
        var $publication = $("#publication-content");
        $publication.empty();
        $(app.pages).each(function (i) {
            $publication.append("<img src='" + app.pages[i] + "' />");
        });

    }

};



jQuery(function(){

    app.init();

    $("form").submit(function(e){ 

        e.preventDefault();

        var publication = $("#publication").val(),
            day         = app.buildIntString( $("#day").val() ),
            month       = app.buildIntString( $("#month").val() ),
            year        = $("#year").val();

        app.getPublication(publication, day, month, year);

        return false;

    });

});























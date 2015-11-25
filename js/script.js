
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
    getPublication: function (publication, day, month, year, img_quality) {

        //The newspaper library starts from Oct 1 2010

        this.processPages(publication, day, month, year, img_quality);


        this.navigation.currentPage = 1;
        this.navigation.totalPages = this.pages.length;

        this.renderPages();

        this.navigateTo("first");

    },
    processPages: function (publication, day, month, year, img_quality) {

        var publicationData = this.publications[publication];

        app.pages = [];
        app.stopSearching = false;

        for (p = 1; p <= publicationData.maxPages; p++) {

            if(this.stopSearching === false){

                var pageURL = this.buildPageURL(this.buildIntString(p), publication, year, month, day, img_quality);

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
    navigateTo: function(to){

        var currentPage = this.navigation.currentPage,
            lastPage    = this.navigation.totalPages,
            pageTo      = 0;

        switch (to){
            case "first":
                pageTo = 1;
                break;
            case "last":
                pageTo = lastPage;
                break;
            case "prev":
                pageTo = (1 == currentPage) ? 1 : currentPage - 1;
                break;
            case "next":
            default:
                pageTo = (lastPage == currentPage) ? lastPage : currentPage + 1;
        }

        this.navigation.currentPage = pageTo;

        $("#publication-content img").addClass("hidden");

        var $img = $("#page-" + this.buildIntString(pageTo));

        $img.toggleClass("hidden");

    },
    navigation: {
        currentPage: 0,
        totalPages: 0
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
    buildPageURL: function(page, publicationName, year, month, day, img_quality){

        var img_q = ((img_quality == "low") ? 1 : 2),
            baseURL = "http://www.eid.com.mx/edicionimpresa/" +
            year + "/" + month + "/" + day + "/" +
            publicationName + "/seguro/files/assets/mobile/pages/page00";

        return baseURL + page + "_i"+img_q+".jpg";

    },
    buildIntString: function (i) {
        return (i < 10) ? "0" + i.toString() : i.toString();
    },
    renderPages: function(){
        //publication-content
        var $publication = $("#publication-content");
        $publication.empty();
        $(app.pages).each(function (i) {
            $publication.append("<img id='page-" + app.buildIntString(i + 1) + "' class='img-responsive center-block hidden' src='" + app.pages[i] + "' />");
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
            year        = $("#year").val(),
            img_q       = $("input[name='img_q']:checked").val();

        //console.log($("input[name='img_q']:checked").val());

        app.getPublication(publication, day, month, year, img_q);

        $('.navbar-toggle').click();

        return false;

    });

    $("#controls-first-page").on("click", function(){
        app.navigateTo("first");
    });

    $("#controls-prev-page").on("click", function(){
        app.navigateTo("prev");
    });

    $("#controls-next-page").on("click", function(){
        app.navigateTo("next");
    });

    $("#controls-last-page").on("click", function(){
        app.navigateTo("last");
    });

});























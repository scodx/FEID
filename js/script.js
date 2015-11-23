
var app = {
    init: function () {

        var currentDate = this.currentDate;

        this.fillDateSelects();

        $("#day").val(currentDate.getUTCDate());
        $("#month").val(currentDate.getUTCMonth());
        $("#year").val(currentDate.getUTCFullYear());

    },
    publications: {
        tabascohoy: {
            pages: 56
        },
        criollo: {
            pages: 32
        },
        basta: {
            pages: 40
        },
        campeche: {
            pages: 32
        }
    },
    currentDate: new Date(),
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

        var pages = this.processPages(publication, day, month, year);

        this.renderPages(pages);



    },
    processPages: function (publication, day, month, year) {
        var pages   = [],
            page    = 0,
            baseURL = "http://www.eid.com.mx/edicionimpresa/" +
                year + "/" + month + "/" + day + "/" +
                publication + "/seguro/files/assets/mobile/pages/page00",
                publication = this.publications[publication];

        for (p = 1; p <= publication.pages; p++) {
            page = (p < 10) ? "0" + p.toString() : p.toString();
            pages.push(baseURL + page + "_i1.jpg");
        }

        return pages;

    },
    renderPages: function(pages){
        //publication-content
        var $publication = $("#publication-content");
        $publication.empty();
        $(pages).each(function (i) {
            $publication.append("<img src='" + pages[i] + "' />");
        });


    }


}

;



jQuery(function(){

    app.init();


    $("form").submit(function(e){

        e.preventDefault();

        var publication = $("#publication").val(),
            day         = $("#day").val(),
            month       = $("#month").val(),
            year        = $("#year").val();

        app.getPublication(publication, day, month, year);

        return false;

    });



});























$(function() {
    var laneOrder = [
        'lane-backlog',
        'lane-progress',
        'lane-done',
        'lane-archived',
    ];

    function laneOrganizer() {
        laneOrder.map(function(lane, index) {
            $("#"+lane).css({left: index*270, top: 0, zIndex: index});
        });
    }

    // Draggable lanes
    $(".lane").draggable({
        revert: "invalid",
        start: function (event, ui) {
            $(this).css({zIndex: 99});
        }
    });

    $(".snap").droppable({
        accept: ".lane",
        drop: function (event, ui) {
            var dropped = ui.draggable;
            var droppedOn = this;

            var globalLeft = dropped.position().left;
            var column = globalLeft/200;
            var column = Math.round(column);

            column = Math.min(laneOrder.length-1, column);
            column = Math.abs(column);

            var sourceId = dropped.attr("id");
            var sourceIndex = laneOrder.indexOf(dropped.attr("id"))

            var destinationId = laneOrder[column];
            var destiationIndex = column;

            laneOrder[sourceIndex] = destinationId;
            laneOrder[destiationIndex] = sourceId;

            laneOrganizer();
        }
    });

    // Draggable cards
    $(".connectedSortable").sortable({
        connectWith: ".connectedSortable",
        start: function(){
            $(this).closest(".lane").css({
                zIndex: 99
            });
        },
        stop: function(){
            laneOrganizer();
        }        
    }).disableSelection();

    $(".card").on("click", function() {
        openCard({
            text: $(this).text()
        });
    });

    // Card window
    $("#dialog").dialog({
        width: 400,
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 200
        },
        hide: {
            effect: "puff",
            duration: 200
        }
    });

    $("#datepicker").datepicker();
    $("#tabs").tabs();

    function openCard(params) {
        $("#dialog").find(".dialog-text").text(params.text);
        $("#dialog").dialog( "open" );
    }

    // Custom component
    $.widget("custom.visibilityToggle", {
        options: {},
        _create: function () {
            this.element.find("select").selectmenu();
        },
        _destroy: function () {},
        random: function () {}
    });

    $( "#visibility-menu" ).visibilityToggle();


    // Redraw
    laneOrganizer();
});


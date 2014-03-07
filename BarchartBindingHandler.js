
ko.bindingHandlers.barchart = (function (){
    var self = {},
        margin = { top: 20, right: 20, bottom: 150, left: 50 },
        width = 300,
        height = 300,
        svg,
        x,
        y,
        data,
        xAttr,
        yAttr,
        xAxis,
        yAxis;

    var getObservableData = function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        if (!value || !value.data || !value.x || !value.y) {
            return;
        }

        data = ko.utils.unwrapObservable(value.data),
            xAttr = value.x,
            yAttr = value.y;
        
        if (value.width) {
            width = ko.utils.unwrapObservable(value.width);
        }
        if (value.height) {
            height = ko.utils.unwrapObservable(value.height);
        }
    };

    var getXValue = function (dataItem) {
        return ko.utils.unwrapObservable(dataItem[xAttr]);
    };
    
    var getYValue = function (dataItem) {
        return ko.utils.unwrapObservable(dataItem[yAttr]) / 100;
    };

    var plot = function () {
        
        svg.selectAll(".bar").remove();
        svg.selectAll("g.y.axis").remove();
        svg.selectAll("g.x.axis").remove();

        x.domain(data.map(function (d) {
            return getXValue(d);
        }));

        y.domain([0, d3.max(data, function (d) {
            return getYValue(d);
        })]);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function (d) {
                    return "rotate(-65)"
                });;

        svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Stock %");

        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(getXValue(d));
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(getYValue(d)); })
            .attr("height", function (d) {
                return height - y(getYValue(d));
            });
    };

    self.init = function (element, valueAccessor, allBindingsAccessor) {

        getObservableData(element, valueAccessor, allBindingsAccessor);

        x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
        y = d3.scale.linear().range([height, 0]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        svg = d3.select(element).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        plot();
    };
    
    self.update = function (element, valueAccessor, allBindingsAccessor) {

        getObservableData(element, valueAccessor, allBindingsAccessor);

        plot();
    };
    
    return self;
})();
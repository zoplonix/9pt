(function(d, script) {
    //todo: this whole function is slow and garbage
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = step2;
    script.src = 'https://code.jquery.com/jquery-3.5.0.min.js';//todo: no conflict 
    d.getElementsByTagName('head')[0].appendChild(script);

    function step2(script)
    {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = main;
        script.src = 'https://requirejs.org/docs/release/2.3.6/minified/require.js';
        d.getElementsByTagName('head')[0].appendChild(script);
    }
}(document));

/**
 * need to consider z-index, stuff will always be appearing underneath stuff and make it hard to debug
 *      outline wireframe type view? $9pt.outline() on console
 */

function main()
{
    require(["/css-parser/lib/parse/index-browser.js"], function(cssParse)
    {
        $('head')
            .append('<link href="9pt.css" type="text/css" rel="stylesheet" />')//i know i know ga
            
        window.$9pt = new NinePoint();

        var $window = new $9ptElement($(window), ()=> window.innerWidth, ()=> window.innerHeight)
        var $9ptObjects = {'window': $window};

        $(window).on('resize', $window.update)

        $('link[rel="9pt"]').each(function()
        {
            var $link = $(this);

            $.ajax({
                url: $link.attr('href') + '?r=' + Math.random(), 
                complete: (x) =>
                {
                    var ninePtCSS = x.responseText;

                    $9pt.addCSS(ninePtCSS)
                    
                }
            })
        })

        $('style[type="9pt"]').each(function(){
            var $style = $(this);

            $9pt.addCSS($style.html())
        })

        function ninePoints(width, height)
        {
            var 
                halfWidth = width / 2,
                halfHeight = height / 2
            ;

            var points = {
                1: [0,            0         ],
                2: [halfWidth,    0         ],
                3: [width,        0         ],
                4: [0,            halfHeight],
                5: [halfWidth,    halfHeight],
                6: [width,        halfHeight],
                7: [0,            height    ],
                8: [halfWidth,    height    ],
                9: [width,        height    ]
            }

            return points;
        }

        function $9ptElement($selector, widthFunction, heightFunction)
        {
            var points = {};

            var relations = {
                1:[],
                2:[],
                3:[],
                4:[],
                5:[],
                6:[],
                7:[],
                8:[],
                9:[]
            }

            update();
            
            function addRelation(point, computationFunction)
            {
                relations[point].push(computationFunction)
                update();
            }

            function width()
            {
                return widthFunction ? widthFunction($selector) : $selector.width();
            }

            function height()
            {
                return heightFunction ? heightFunction($selector) : $selector.height();
            }

            function update()
            {
                points = new ninePoints(width(), height());

                var offset = {left:0, top:0}

                try{//cause window doesn't have an offset. just easier to write this then fix the window case
                    offset = $selector.offset();
                }
                catch(e){}

                for(var i = 1; i <= 9; i++)
                {
                    for(var relation of relations[i])
                    {
                        points[i][0] += offset.left
                        points[i][1] += offset.top
                        relation(points[i]);
                    }
                }
            }

            return {
                addRelation,
                update,
                //could prbably make a consructor function for these since they are all the same
                //but it is computationally faster and quicker to write/debug if they are declared implicitly 
                //only downside is that it is ugly, multiple cursors make it maintainanle

                //computation functions
                1:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1], left:point[0]});
                        update();
                    }
                },
                2:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[2][1], left:point[0] - points[2][0]});
                        update();
                    }
                },
                3:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[3][1], left:point[0] - points[3][0]});
                        update();
                    }
                },
                4:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[4][1], left:point[0] - points[4][0]});
                        update();
                    }
                },
                5:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[5][1], left:point[0] - points[5][0]});
                        update();
                    }
                },
                6:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[6][1], left:point[0] - points[6][0]});
                        update();
                    }
                },
                7:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[7][1], left:point[0] - points[7][0]});
                        update();
                    }
                },
                8:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[8][1], left:point[0] - points[8][0]});
                        update();
                    }
                },
                9:function()
                {
                    return function(point)
                    {
                        $selector.css({top:point[1] - points[9][1], left:point[0] - points[9][0]});
                        update();
                    }
                }
            }
        }

        var pointNames = {
            //the one situation where counting from 1 makes sense.
            //can easily check pointNames['blah'] to see if it exists
            //if pointNames['blah'] == 0 then it exists in the list but js will think false
            //so count from 1
            //easy enough to visualize 9 points and their ids. 
            //in some situations it is easier to think in the id rather than the proper name
            //much easier to think in terms of 
            //123
            //456
            //789
            //rather than
            //012
            //345
            //678
            //it is 9 points ater all
            'p1': 1, 
            'top-left': 1,
            'left-top': 1,

            'p2': 2,
            'top-center': 2,
            'center-top': 2,
            'top-middle': 2,
            'middle-top': 2,

            'p3':3,
            'top-right': 3,
            'right-top': 3,

            'p4': 4,
            'left-middle': 4,
            'middle-left': 4,
            'center-left': 4,
            'left-center': 4,

            'p5': 5,
            'center': 5,
            'middle': 5,
            'center-center': 5,
            'middle-middle': 5,
            'center-middle': 5,
            'middle-center': 5,

            'p6': 6,
            'right-middle': 6,
            'middle-right': 6,
            'center-right': 6,
            'right-center': 6,

            'p7': 7,
            'bottom-left': 7,
            'left-bottom': 7,

            'p8': 8,
            'bottom-center': 8,
            'center-bottom': 8,
            'bottom-middle': 8,
            'middle-bottom': 8,

            'p9':9,
            'bottom-right': 9,
            'right-bottom': 9, //the hardest thing to find
        }

        function NinePoint()
        {
            var cssList = [];

            //todo:scan for all elements and add base styles/layout to them. 
            //would say that block elements follow block elements. 
            /*
                <h1></h1>
                <p></p>
            */
            //elements inside elements appear inside them and stay with them wherever they are positioned
            /*
                <div>
                    <p></p>
                </div>
            */
            //and basic table jazz
            //just he basic layout bits that we take out by making everything absolutely positioned

            function addCSS(rawCSS)
            {
                var newCSSId = cssList.push(cssParse(rawCSS)) - 1;

                var css = cssList[newCSSId];

                for(var rule of css.stylesheet.rules)
                {
                    if(rule.type == 'rule')
                    {
                        for(var selector of rule.selectors)
                        {
                            $9ptObjects[selector] = new $9ptElement($(selector))
                        }
                    }
                }
                
                for(var rule of css.stylesheet.rules)
                {
                    if(rule.type == 'rule')//todo: try catch log line number
                    {//todo: passthrough for non-9pt stlyes so that all styles can be written in one css file
                        for(var declaration of rule.declarations)
                        {
                            if(declaration.type == 'declaration')
                            {
                                for(var selector of rule.selectors)
                                {    
                                    var 
                                        functionParts = declaration.value.split('('),

                                        sourceSelector = functionParts[1].slice(0, -1),
                                        sourcePoint = pointNames[functionParts[0]],

                                        destinationSelector = selector,
                                        destinationPoint = pointNames[declaration.property]
                                    ;

                                    $9ptObjects[sourceSelector].addRelation(sourcePoint, $9ptObjects[destinationSelector][destinationPoint]())
                                    
                                    //could save this text kinda like this in a js file and use for pre-compiled 9pt css, seems fast enough without doing this tho
                                    //probably makes more sense to get the jquery / require / cssParse package loading to be better
                                    //console.log(`$('${sourceSelector}').addRelation(${sourcePoint}, $('${destinationSelector}')[${destinationPoint}]()`)
                                }
                            }
                        }
                    }
                }
            }

            return {
                addCSS,
                cssList
            }
        }
    });
}
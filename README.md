# Update - Working Code

To get the code working you will have to run it from a webserver of some kind.

Browse to `example.html` and play around with resizing your browser.

Quick server to get up and running if you have nodejs installed:

    npm install http-server -g
	cd {9pt folder}
	http-server

<hr>

# ![9pt](https://raw.githubusercontent.com/zoplonix/9pt/master/9pt-logo.png) 

## Logical Layout System for CSS

<hr>

> How do you make a web developer laugh?
>
> Ask them how to center something vertically with CSS
>
> How do you make them cry?
>
> Pay them to do it.

<hr>

Aligning something in CSS is an equivalent experience to aligning an image in Microsoft Word. This is called "floating" in CSS and is the work of the devil himself.

Want to center a box? Well just use margin 0 auto, duh its so intuitive. Also the parent element needs other bullshit properties, sometimes. Want to vertically center? Use flexbox, it only takes a 20 page article on your favorite CSS site to describe, and you have to learn entirely new concepts you've never heard of before (and isn't full defined or implemented). Its so fun!

Its all bullshit and it stops with this package

Lets be honest, when you want to align something, there is someting you want to align it to. Why can't you just say where to align it on that something 

Every other application I have ever used (besides Word) has the most intuitive system - choose the thing you want to align, choose the thing to align it to, and how to align it (edges or centers)

	[photoshop example]

	[other example?]

So why can't we implement this in CSS

Imagine each block element has 9 points - 1 on each corner, 1 in the middle of each side and one in the center.

	[9pt image]

Instead of floating or flexing or giving up and making everyhing absolutely positioned, you simply declare the element you want to align and where to align it on the other element

Each point would be labled like so, with the order of the words not mattering

- top-left
- top-center
- top-right
- left-middle
- center-center, middle-middle, or center-middle (or middle-center)
- bottom-left
- bottom-center
- bottom-right

Imagine the following HTML

    <div id="A"></div>
    <div id="B"></div>

And the following css

	#A{
		width:100px; height:100px;
		border:3px solid red;
	}

	#B{
		width:100px; height: 100px
		border:3px solid blue;
		
		top-left: top-right(#A) /*the top left of #B is stuck to the top right of #A*/
	}

Would produce this result:

	[image of red square with blue square to the right of it]

Consider this example:

	<div id="C">
	  <div id="D"></div>
	</div>

	#C{
		width:500px; height:500px;
		border:3px solid red;
	}

	#D{
		width:100px; height: 100px
		border:3px solid blue;
		
		middle-middle: center-center(#C) /*the midde-middle of #D is stuck to the center-center of #C*/
	}

	[image of small blue square centered in larger red square]

this alignment relationship could aslo be abstract and defined the other way around

	#A{
		top-right: sibbling(top-left) shit rewrute these three the other way around: position(sibbling)
	}

	#C{
		center-center: child(center-center)
	}

or

	#D{
		center-center: parent(center-center)
	}

example:

	<div id="E">
	  <div class="F"></div>
	  <div class="F"></div>
	  <div class="F"></div>
	  <div class="F"></div>
	  <div class="F"></div>
	</div>

	#E{
		width:500px; height:500px;
		border:3px solid red;
	}

	.F{
	  width:100px; height: 100px
	  border:3px solid blue;
	  
	  top-left: top-right(sibbling)
	  or
	  top-left: top-right(.F)
	}

	[image of red square with 5 blue squares next to each other and overflowing the red one.]

## types of relationships
-child
-sibbling
-parent

## aligning to body

## aligning to viewport (aka position:fixed)

## What about padding margins?

Imagine our initial examples but with some margins/padding

	#A, #B, #D{
	  margin: 10px
	}

	#C{
	 padding: 10px
	}

This creates an extra set of points to align to (blue for margins, red for padding [black for default points])

By default, if the element has margins/padding defined, then when you specify you want to align to a point on that element, then you align to the margin/padding point as you would expect (margin if you are sibling, padding if you are a child of)

but you can also specify you want a specific point
syntax:

	margin/padding/auto(default)/parent/inherit are properties

	top-left: top-right(#A) margin

## IMPORTANT: NO NEGATIVE MARGINS/PADDINGS

the point of this is to eliminate horrible alignment practices and the worse one is negative paddings and margins. using this system it should eliminate all clasical uses of negative margins/paddings so if any are used it should break the rendering of the document as any syntax error would and should give an error message warning of this practice.

however creativity should not be squandered, so in this error message, not only will it discourage heavily the idea of negativity in this case, it will also describe a way to allow negative margins by adding the !negative declaration to the end of the line of css - the exact same way !important is used

while we're at it, vertical/horizontal height = 100% or rather any size/position can depend on any other elements size/position - even if the aren't close family in the html - using the same syntax as before

	width: width(body)
	height: height(#myElement)

can cross streams too why not

	width: height(#myElement)

and hell why not allow math in there too (for sizing and position)

Can also define to stick edges together if that is the only precision needed

	top: bottom(#A)

also can use a shorthand

so instead of saying

	top-center: bottom-center

only center would need to be writted once and implied elsewhere so the previous example would also equal

	top: bottom-center
	or
	top-center: bottom

## The plan

1.Implement this as a JS script that would parse a specially linked/defined CSS and render the html accordingly
1.a. can we be rid of link href type is css and the rel is the document please? how bout a <css src="" /> tag (or <css></css>) so that browsers ignore it until they catch up and the script knows to parse those. lead the way for what css4 should be
2.redo some popular websites/layouts with this to show that its better
3. promote it
3. get enough widespread adoption that browsers and the CSS working group implement this and so that I can get some work done that isn't fucking around making sure things align properly when it took someone 2 seconds to figure out how to align it in photoshop and it takes one all fucking day in CSS and HTML


## Implementation

- This would be implemented using the absolute/relative/fixed positioning system in CSS - the only one that makese sense.

- The CSS would get parsed and an internal spreadsheet would be built describing the positional relationships between all elements

- then the positions for each element would be calulated and the proper absolute/relative/fixed css applied to each element

- an event listener would wait for any changes to html/css and then be able to use the spreadsheet to recalculate and apply only the new positions/sizes that need to be changed

- Implementation would consist of multiple modules being joined together

	- css parser https://github.com/jotform/css.js
    
	- spreadsheet aka dependancy graph - likely build from scratch as will need custom walkers and other custom crap
    
	- debugger - an addon for F12?
    
	- custom css interpreter
    
	- 

## First steps

-flesh out description better - add other examples from notes, make screenshots/logo

-Get project directory properly setup with package.json and all that jazz

-get css parser working

-filter out any css that we don't deal with and pass it along to the browser

-move to dependancy graph / custom interpreter stuff

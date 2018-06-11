# preact hotspot editor

To load, first define the options, then load the script asynchronously. The
editor takes a callback what will be called with the hotspot array whenever the
user clicks "save". Return true from this if there are no errors.

```html
<script>
var hotspots = [
        {
            "type": "rect",
            "x": 100,
            "y": 200,
            "width": 300,
            "height": 150,
            "text": "Rectangle"
        },
        {
            "type": "ellipse",
            "cx": 300,
            "cy": 300,
            "rx": 50,
            "ry": 90,
            "text": "Ellipse"
        },
        {
            "type": "polygon",
            "points": [[500, 600], [550, 525], [550, 575], [600, 500]],
            "text": "Polygon"
        }
    ];

    window.HotspotEditorData = {
        image: "myimage.png",
        width: 500,
        height: 500,
        hotspots: hotspots,
        selector: "#editor",
        saveHotspots: function (hotspots) {
            console.log("saving stuff", hotspots);
            //Save the data
            return true;
        }
    }

</script>
<div id="editor">Loading hotspot editor</div>
<script defer src="bundle.js"></script>
```

The syntax is similar to display the image with hotspots. Instead of the
`saveHotspots` callback, there is an `onClick` callback that is called when a
hotspot is clicked. It is passed the hotspot object. You probably want the
`text` property. ALternatively, set the `modal` property to `true` and it will
open a modal on click.

```html
<script>
var hotspots = [
        {
            "type": "rect",
            "x": 100,
            "y": 200,
            "width": 300,
            "height": 150,
            "text": "Rectangle"
        },
        {
            "type": "ellipse",
            "cx": 300,
            "cy": 300,
            "rx": 50,
            "ry": 90,
            "text": "Ellipse"
        },
        {
            "type": "polygon",
            "points": [[500, 600], [550, 525], [550, 575], [600, 500]],
            "text": "Polygon"
        }
    ];

    window.HotspotViewerData = {
        image: "complications.png",
        width: 778,
        height: 780,
        hotspots: hotspots,
        selector: "#viewer",
        modal: true
    }
</script>
<div id="viewer">Loading viewer</div>
<script defer src="bundle.js"></script>
```

For examples, see [the editor](src/assets/editor.html) and
[the viewer](src/assets/viewer.html).

### Credits

By Matt Kane

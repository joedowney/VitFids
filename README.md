# VitFids
A derivative of [FitVids](https://github.com/davatron5000/FitVids.js) for making fluid width video embeds. VitFids adds the ability to set a maximum width on the videos.

## Examples

Basic example

```javascript
    $('.container').vitFids();
```

... with options

```javascript
    $('.container').vitFids({
        customSelector: 'iframe[src^='http://catvidz.org']',
        ignore: '.dont-resize-me',
        maxWidth: 800
    });
```

## Options

| Option         | Value                   | Description                                                                                                              |
|----------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------|
| customSelector | string of css selectors | extends the default options for which types of videos the plugin affects                                                 |
| ignore         | string of css selectors | the plugin will ignore elements with this class                                                                          |
| maxWidth       | integer                 | the maximum number of pixels that the plugin will allow the video to be. if this is not set the video width will be 100% |
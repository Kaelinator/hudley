# Hudley

Visualize your car's data and overlay it on your video.

Compatible with Holley Terminator X & X Max datalogs.

## Download

### Version 1.0.0

- [Windows .zip](https://kaelkirk.com/static/hudley-win32-x64-1.0.0.zip)
  - Extract the zip to C:\Users\<name>\AppData\Local\Programs
  - Right click on hudley.exe > Show More Options > Send to > Desktop (create shortcut)
- [Linux .deb](https://kaelkirk.com/static/hudley_1.0.0_amd64.deb)
- [Linux .rpm](https://kaelkirk.com/static/hudley-1.0.0-1.x86_64.rpm)

## How to use

**Hudley will not work for compressed `.dlz` datalog files! See below.**

Take your `.dlz` (compressed) datalog and open it in the Terminator X V3 software.
This will produce a `.dl` (uncompressed) datalog file which may then be opened using Hudley.

The Data Points list will populate once the datalog is read, and you can add them to the canvas using the plus sign.
This will add the data point to the Components list,
where you may edit its display size, position, color, and much more by clicking the pencil, or delete it by clicking the trash can.
You may also create a data point, name it, select its unit of measure, and how to populate it.

In the upper-left corner of the view, you may select the canvas or spreadsheet.
The canvas is the "what you see is what you get" display--only difference being that the gray boxes
are replaced by transparent pixels upon rendering your webm file.
The spreadsheet allows you to see all the datapoints that were read from the datalog and to modify custom data points.
Use Ctrl+Click and Shift+Click to modify more than one cell at once.

Under Project Settings, you may set a Start and an End point to reduce the output duration, file size, and rendering time.
You may also modify the frame rate and canvas size.
To render your webm, you must first select an output file path.
Click Render and wait for the progress bar to complete.
And hot dang, you've got a video that you can simply drag on top of your race footage in your favorite video editor.

## How to dev

```
npm i
npm start
```

## How to test

```
npm test
```

## How to lint

```
npm run lint
```

and to fix all auto-fixable linting issues

```
npm run lint -- --fix
```


## Project Structure

```
- src/
  - main/     node code
  - renderer/ vue code
  - shared/   code shared between node and vue
  - preload/  expose node code to vue code
```

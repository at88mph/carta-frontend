# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
* Added support for changing the depth order of floating widget and dialog on select ([#2307](https://github.com/CARTAvis/carta-frontend/pull/2307)).
* Added the raster matching setting to the preference and improved the raster matching function ([#2004](https://github.com/CARTAvis/carta-frontend/issues/2004) and [#1959](https://github.com/CARTAvis/carta-frontend/issues/1959)).
### Fixed
* Fixed ruler annotation matching bug ([#2242](https://github.com/CARTAvis/carta-frontend/issues/2242)).
* Fixed compass and ruler annotations update bug in the spatially matched image when changing the coordinate ([#2270](https://github.com/CARTAvis/carta-frontend/issues/2270)).
* Removed distance measurement tool render from PV preview frames ([#2267](https://github.com/CARTAvis/carta-frontend/issues/2267)).
* Improved the dragging performance of the Export Region widget when the list of region/annotation to be exported is large ([#1867](https://github.com/CARTAvis/carta-frontend/issues/1867)).
* Fixed the flashing contour rendering during animation ([#579](https://github.com/CARTAvis/carta-frontend/issues/579)).
* Fixed incorrect range values in the save image dialog with non-convertible spectral axis images by supporting native/channel options in the spectral coordinate selector for non-convertible spectral axis images ([#2225](https://github.com/CARTAvis/carta-frontend/issues/2225)).
* Fixed a bug when applying a filter to the shifted frequency column in the spectral line query widget ([#2326](https://github.com/CARTAvis/carta-frontend/issues/2326)).

## [4.1.0]

### Fixed
* Fixed the blank screen when clicking X/Y profile setting button without images opened ([#2247](https://github.com/CARTAvis/carta-frontend/issues/2247)).
* Removed unused help button for PV preview widget ([#2248](https://github.com/CARTAvis/carta-frontend/issues/2248)).
* Fixed PV preview bug where no PV preview shows up after closing a docked PV preview widget ([#2249](https://github.com/CARTAvis/carta-frontend/issues/2249)).
* Fixed the incorrect deletion of contour levels ([#2251](https://github.com/CARTAvis/carta-frontend/issues/2251)).
* Fixed bug that the frontend crashes when deleting annotations if the export window is opened ([#2278](https://github.com/CARTAvis/carta-frontend/issues/2278)).
* Fixed the performance issue when panning images ([#2291](https://github.com/CARTAvis/carta-frontend/issues/2291)).
* Fixed the crash when plotting online Vizier catalog data ([#2321](https://github.com/CARTAvis/carta-frontend/pull/2321)).
* Fixed missing vector overlays on matched images ([#2293](https://github.com/CARTAvis/carta-frontend/issues/2293)).
* Avoided showing the telemetry dialog temporarily ([#2314](https://github.com/CARTAvis/carta-frontend/issues/2314)).
* Fixed failing to match images spatially ([2252](https://github.com/CARTAvis/carta-frontend/issues/2252)).
* Fixed the delayed start of the program due to telemetry server error ([#2304](https://github.com/CARTAvis/carta-frontend/issues/2304)).

## [4.0.0]

### Added
* Added a shortcut button for image annotation ([#2167](https://github.com/CARTAvis/carta-frontend/issues/2167)).
* Added support for AIPS beam images ([#2164](https://github.com/CARTAvis/carta-frontend/issues/2164)).
* Added telemetry data for spectral profile, PV, moment, and catalog creation. ([#2208](https://github.com/CARTAvis/carta-frontend/issues/2208)).
* Added an increase to the default compression ratio to 32 when the header unit of the image is km/s ([#1223](https://github.com/CARTAvis/carta-frontend/issues/1223)).
* Added a toggle in the moment generator to match generated image(s) ([#2121](https://github.com/CARTAvis/carta-frontend/issues/2121)).
* Added automatically generated documentation website.
* Added the ability to share a workspace via URL when using the frontend via the controller.
### Changed
* Changed the default title string in the image viewer ([#2168](https://github.com/CARTAvis/carta-frontend/issues/2168)).
* Modified text annotation textbox to stay the same dimension as user zoom the image ([#2162](https://github.com/CARTAvis/carta-frontend/issues/2162)).
* Disabled spell check in text input ([#2138](https://github.com/CARTAvis/carta-frontend/issues/2138)).
* Support animation playback with matched images in multi-panel view ([#1860](https://github.com/CARTAvis/carta-frontend/issues/1860)).
* Modified spectral matching type selector in Image List Settings won't affect global preferences ([#2098](https://github.com/CARTAvis/carta-frontend/issues/2098)).
* Enabled enter key to trigger filtering in the filter fields, and modified the buttons in the spectral line query widget and catalog widget ([#2046](https://github.com/CARTAvis/carta-frontend/issues/2046)).
* Switched the Splatalogue URL from test to production ([#2238](https://github.com/CARTAvis/carta-frontend/issues/2238)).
* Changed image fitting center position error unit from arcsecond to second when the format is H:M:S; added integrated flux information in the fitting result.
### Fixed
* Fixed bug where line region computation width cannot be changed in spatial profile setting widget ([#2000](https://github.com/CARTAvis/carta-frontend/issues/2000)).
* Fixed when multiple images are open, PV generator can only produce PV preview with live update for one of the images ([#2171](https://github.com/CARTAvis/carta-frontend/issues/2171)).
* Fixed incorrect beam-related and frequency-related intensity unit conversions in the spectral profiler ([#2033](https://github.com/CARTAvis/carta-frontend/issues/2033)).
* Fixed line region anchor rotation degree when the image has non-square pixels ([#1732](https://github.com/CARTAvis/carta-frontend/issues/1732)).
* Fixed the blank screen when using layout with histogram widget ([#2178](https://github.com/CARTAvis/carta-frontend/issues/2178)).
* Fixed the problem of resuming LEL images ([#1226](https://github.com/CARTAvis/carta-backend/issues/1226)).
* Fixed tsv and txt file export naming ([#1987](https://github.com/CARTAvis/carta-frontend/issues/1987)).
* Fixed the spectral line offset by correcting the redshift factor calculation ([#1327](https://github.com/CARTAvis/carta-frontend/issues/1327)).
* Fixed the alignment in workspace dialog ([#2155](https://github.com/CARTAvis/carta-frontend/issues/2155)).
* Fixed the spectral axis for images with headers in `CDi_j` format ([#2144](https://github.com/CARTAvis/carta-frontend/issues/2144)).
* Fixed spatial matching error in sub-milliarcsecond scale ([#1734](https://github.com/CARTAvis/carta-frontend/issues/1734)).
* Fixed inconsistent region coordinate format when images are spatially matched ([#2189](https://github.com/CARTAvis/carta-frontend/issues/2189)).
* Fixed the right ascension label in the image view ([#2192](https://github.com/CARTAvis/carta-frontend/issues/2192)).
* Fixed the multi-spectral-profile intensity unit conversion ([#1758](https://github.com/CARTAvis/carta-frontend/issues/1758)).
* Fixed the Jy/beam to K intensity unit conversion ([#1907](https://github.com/CARTAvis/carta-frontend/issues/1907)).
* Fixed the blinking toolbar in the image view during animating images ([#2163](https://github.com/CARTAvis/carta-frontend/issues/2163)).
* Fixed image arithmetic bug when there are square brackets in the expression ([#2220](https://github.com/CARTAvis/carta-frontend/issues/2220)).
* Fixed missing tiles and distorted tiles during and after animation. ([#1988](https://github.com/CARTAvis/carta-frontend/issues/1988)).
* Fixed the stuck of stokes animation at low frame rates ([#1293](https://github.com/CARTAvis/carta-backend/issues/1293)).

## [4.0.0-beta.1]

### Added
* Added two entries in Service sub-menu to copy the session ID and the session URL to clipboard ([#1930](https://github.com/cartavis/carta-frontend/issues/1930)).
* Added a button for NaN pixel color selection in render config widget ([#1946](https://github.com/cartavis/carta-frontend/issues/1946)).
* Added a setting dialog for the angular distance measurement ([#1201](https://github.com/cartavis/carta-frontend/issues/1201)).
* Added the functionality to show/hide and lock all regions ([#1796](https://github.com/cartavis/carta-frontend/issues/1796)).
* Added a method to auto-scrolling the selected region into the region list view ([#1797](https://github.com/CARTAvis/carta-frontend/issues/1797)).
* Added the functionality to mirror cursor position on spatially matched frame via hotkey "G" ([#1947](https://github.com/cartavis/carta-frontend/issues/1947)).
* Added support for fitting images with regions, fixed parameters, a background offset, and different solvers; added support for setting initial values in world coordinates; added support for generating model and residual images, exporting fitting result and full log, and creating regions from the results; added support for estimating progress and cancelling tasks ([#1397](https://github.com/CARTAvis/carta-frontend/issues/1397)).
* Added tooltip to the Image column for the image list and cursor info widget ([#1948](https://github.com/CARTAvis/carta-frontend/issues/1948)).
* Added additional cursor info option to spectral profile widget ([#1837](https://github.com/CARTAvis/carta-frontend/issues/1837)).
* Added a selection option in the PV generator widget to swap x and y axis, an input for spectral axis limit, and a toggle button to let users decide whether or not to keep the previously generated PV images ([#1950](https://github.com/cartavis/carta-frontend/issues/1950), [#1951](https://github.com/cartavis/carta-frontend/issues/1951), [#1952](https://github.com/cartavis/carta-frontend/issues/1952)).
* Added a toggle button to let users decide whether or not to keep the previously generated moment images ([#2054](https://github.com/CARTAvis/carta-frontend/issues/2054)).
* Added settings in the image view settings widget for panning and zooming the images ([#1176](https://github.com/CARTAvis/carta-frontend/issues/1176)).
* Added layout renaming dialog ([#458](https://github.com/CARTAvis/carta-frontend/issues/458)).
* Added supports for swapped-axes image cubes ([#1953](https://github.com/CARTAvis/carta-frontend/issues/1953)).
* Added supports for image annotations ([#267](https://github.com/CARTAvis/carta-frontend/issues/267)).
* Added the ability of changing to a new directory by entering a path ([#609](https://github.com/CARTAvis/carta-frontend/issues/609)).
* Added supports for customizing histogram calculations ([#1488](https://github.com/CARTAvis/carta-frontend/issues/1488)).
* Added pv image preview feature ([#1561](https://github.com/CARTAvis/carta-frontend/issues/1561)).
* Added support for saving and restoring workspaces ([#1272](https://github.com/CARTAvis/carta-frontend/issues/1272)). Initial support is limited to restoring open images, render/contour/overlay configs and regions.
### Fixed
* Fixed the issue of annoying text input fields ([#1906](https://github.com/CARTAvis/carta-frontend/issues/1906)).
* Fixed the issues of copying the Session URL in the macOS Electron and Linux AppImage versions ([#2102](https://github.com/CARTAvis/carta-frontend/issues/2102), [#2108](https://github.com/CARTAvis/carta-frontend/issues/2108)).
* Fixed the issue of contour levels not deleted as intended ([#2091](https://github.com/CARTAvis/carta-frontend/issues/2091)).
* Fixed issue of only enabling catalog selection button when there is a layer of catalog overlay ([#1826](https://github.com/CARTAvis/carta-frontend/issues/1826)).
* Fixed the issue of the corrupted spatial profile when cursor is moving ([#1602](https://github.com/CARTAvis/carta-frontend/issues/1602)).
* Fixed NaN pixel value in the cursor info bar of the image viewer when the image is 1x1 pixel ([#1879](https://github.com/CARTAvis/carta-frontend/issues/1879)).
* Fixed issue to show cursor info of smoothed profiles in the spatial and spectral profilers ([#1880](https://github.com/CARTAvis/carta-frontend/issues/1880), [#1938](https://github.com/CARTAvis/carta-frontend/pull/1938)).
* Fixed mean and RMS not updating when smoothing in the spatial and spectral profilers ([#1838](https://github.com/CARTAvis/carta-frontend/issues/1838)).
* Fixed limitations of the point size for catalog overlay rendering ([#1662](https://github.com/CARTAvis/carta-frontend/issues/1662) and [#1802](https://github.com/CARTAvis/carta-frontend/issues/1802)).
* Fixed the issue of updating image view mode when catalog selection button is disabled ([#1967](https://github.com/CARTAvis/carta-frontend/issues/1967)).
* Fixed the issue of stuck image viewer after changing single/multi panel mode after catalog selection ([#1989](https://github.com/CARTAvis/carta-frontend/issues/1989)).
* Fixed empty tsv file export for xy profiler ([#2021](https://github.com/CARTAvis/carta-frontend/issues/2021)).
* Fixed missing catalog overlay for single source catalog files ([#2034](https://github.com/CARTAvis/carta-frontend/issues/2034)).
* Fixed the region position offset mismatch problem after zooming to fit for spatially matched images. ([#2028](https://github.com/CARTAvis/carta-frontend/issues/2028)).
* Improved the performance of loading regions in batches ([#2040](https://github.com/CARTAvis/carta-frontend/issues/2040)).
* Fixed offset between cusorInfo and upper wcs axis in the spatial profilers ([#1319](https://github.com/CARTAvis/carta-frontend/issues/1319)).
* Fixed mismatch between cursor and image during PV image panning ([#1790](https://github.com/CARTAvis/carta-frontend/issues/1790)).
* Fixed the hanging problem for computed stokes animation ([#1238](https://github.com/CARTAvis/carta-backend/issues/1238)).
* Fixed the AST grid rendering issues in different reference systems due to missing explicit equinox in the setup ([#2106](https://github.com/CARTAvis/carta-frontend/issues/2106)).
* Fixed crash when sending spectral line queries without network connection ([#2119](https://github.com/CARTAvis/carta-frontend/issues/2119)).
### Changed
* Re-arranged the order of File menu ([#2092](https://github.com/CARTAvis/carta-frontend/issues/2092)).
* Increased the upper limit of averaging width for line/polyline spatial profiles or PV images calculations ([#1949](https://github.com/CARTAvis/carta-frontend/issues/1949)).
* Set white color or black color, based on the theme, as the background for the image view PNG export ([#2029](https://github.com/CARTAvis/carta-frontend/issues/2029)).
* Spectral line queries are migrated to Splatalogue advanced backend queries due to the upcoming deprecation of the current Splatalogue frontend queries ([#2114](https://github.com/CARTAvis/carta-frontend/issues/2114)).

## [3.0.1]

### Fixed
* Fixed issue with dashboard address ([#1991](https://github.com/CARTAvis/carta-frontend/issues/1991)).

## [3.0.0]

### Added
* Added support for image fitting with field of view ([#1397](https://github.com/CARTAvis/carta-frontend/issues/1397)).
* Size conversion in the image fitting results ([#1397](https://github.com/CARTAvis/carta-frontend/issues/1397)).
* Show a notification when there is a new CARTA release ([#1852](https://github.com/CARTAvis/carta-frontend/issues/1852)).
* Added links to the CARTA Dashboard to the splashscreen and alert dialog where appropriate ([#1874](https://github.com/CARTAvis/carta-frontend/issues/1874)).
### Changed
* Splatalogue queries are now made directly with the server, rather than proxied through the backend ([#1755](https://github.com/CARTAvis/carta-frontend/issues/1755)).
### Fixed
* Added missing vector overlay and image fitting options in the View menu ([#1848](https://github.com/CARTAvis/carta-frontend/issues/1848)).
* Hide code snippet option in the View menu when code snippet is disabled in the preferences ([#1856](https://github.com/CARTAvis/carta-frontend/issues/1856)).
* Fixed the rotation anchor offset of line regions ([#1739](https://github.com/CARTAvis/carta-frontend/issues/1739)).
* Fixed issue with exporting decimated data instead of full resolution data in spatial profiler ([#1546](https://github.com/CARTAvis/carta-frontend/issues/1546)).
* Fixed larger position errors of projected contours, catalog overlays, and vector overlays near the border ([#1843](https://github.com/CARTAvis/carta-frontend/issues/1843)).
* Fixed no updating of spatial profile after region deleting ([#1831](https://github.com/CARTAvis/carta-frontend/issues/1831), [#1855](https://github.com/CARTAvis/carta-frontend/issues/1855)).
* Fixed unable to switch channel by clicking scatter plot in stokes analysis widgets ([#1313](https://github.com/CARTAvis/carta-frontend/issues/1313)).
* Fixed issues of crowded Frame idices in the animator and misalignment of channel slider indices ([#940](https://github.com/CARTAvis/carta-frontend/issues/940), [#1892](https://github.com/CARTAvis/carta-frontend/issues/1892)).
* Fixed gaps in projected unclosed regions ([#1740](https://github.com/CARTAvis/carta-frontend/issues/1740)).
* Fixed projection of polygon regions created on spatially matched images ([#1887](https://github.com/CARTAvis/carta-frontend/issues/1887)).
* Fixed incorrect channels of matched images requested for animation ([#569](https://github.com/CARTAvis/carta-frontend/issues/569)).
* Fixed issue of showing last index of animator sliders ([#1893] (https://github.com/CARTAvis/carta-frontend/issues/1893)).
* Fixed tooltip blocking issue of the toolbar in the image viewer ([#1897](https://github.com/CARTAvis/carta-frontend/issues/1897)).
* Fixed persisent tooltip after exporting a png image ([#1742](https://github.com/CARTAvis/carta-frontend/issues/1742)).
* Fixed high CPU/GPU usage when CARTA is idle or attempting to reconnect to server ([#153](https://github.com/CARTAvis/carta/issues/153) and [#1808](https://github.com/CARTAvis/carta-frontend/issues/1808)).
* Fixed incorrect region positions when importing regions on a spatially matched image ([#1899](https://github.com/CARTAvis/carta-frontend/issues/1899)).
* Fixed issue in the spatial profile setting where the "Show WCS Axis" should be disabled for steps and lines plot styles ([#1905](https://github.com/CARTAvis/carta-frontend/issues/1905)).
* Fixed issue when the active frame changes while the region is being imported.
* Fixed the imprecised catalog plot axis. ([#1884](https://github.com/cartavis/carta-frontend/issues/1884)).
* Fixed the displayed values in the cursor info of the histogram widget by adopting binary-searched data x and y values ([#1917](https://github.com/CARTAvis/carta-frontend/issues/1917)).
* Fixed missing regions when the image is matched or unmatched to the reference ([#1780](https://github.com/CARTAvis/carta-frontend/issues/1780)).
* Fixed inconsistent vector line width on spatially matched images ([#1854](https://github.com/CARTAvis/carta-frontend/issues/1854)).
* Fixed QU profile rendering black at the first channel in the stokes widget ([#1786](https://github.com/CARTAvis/carta-frontend/issues/1786)).

## [3.0.0-beta.3]

### Added
* Added cursor information to the histogram widget ([#1762](https://github.com/CARTAvis/carta-frontend/issues/1762)).
* The ability to load files with LEL (lattice expression language) expressions ([#1264](https://github.com/CARTAvis/carta-frontend/issues/1264)).
* The ability to set a custom rest frequency for saving subimages ([#1653](https://github.com/CARTAvis/carta-frontend/issues/1653)).
* The ability to load complex images with a dropdown menu in the file browser dialog ([#1492](https://github.com/CARTAvis/carta-frontend/issues/1492)).
* Added image fitting widget for multiple 2D Gaussian component fitting ([#1397](https://github.com/CARTAvis/carta-frontend/issues/1397)).
* Added computed polarizations (Polarized intensity, Polarized angle ...) in polarization selectors ([#714](https://github.com/CARTAvis/carta-frontend/issues/714)).
* Vector field rendering is supported in the image view widget. Data configuration and stlying can be set in the vector overlay dialog ([#1155](https://github.com/CARTAvis/carta-frontend/issues/1155)).
### Changed
* Optimization to the region list widget with a large number of regions ([#1252](https://github.com/CARTAvis/carta-frontend/issues/1252)).
* Optimization to loading images with a million channels ([#1774](https://github.com/CARTAvis/carta-frontend/issues/1774)).
* Limited the filename length of downloaded png files to around 200 characters ([#1501](https://github.com/CARTAvis/carta-frontend/issues/1501)).
* Enabled text selection for region info and catalog info when loading/saving regions and loading catalogs ([#1795](https://github.com/CARTAvis/carta-frontend/issues/1795)).
### Fixed
* Corrected hard reload shortcut suggestions for macOS ([#1623](https://github.com/CARTAvis/carta-frontend/issues/1623)).
* Fixed region re-rendering with click to pan method ([#1751](https://github.com/CARTAvis/carta-frontend/issues/1751)).
* Fixed the initial spectral range of the moment generator ([#1749](https://github.com/CARTAvis/carta-frontend/issues/1749)).
* Fixed crash when loading file with fewer axes than CDELT entries ([#1769](https://github.com/CARTAvis/carta-frontend/issues/1769)).
* Fixed crash with empty line plots ([#1772](https://github.com/CARTAvis/carta-frontend/issues/1772)).
* Fixed issue with PV image rendering ([#1708](https://github.com/CARTAvis/carta-frontend/issues/1708)).
* Tab title of image viewer is reset when all images are closed ([#1686](https://github.com/CARTAvis/carta-frontend/issues/1686)).
* Fixed issue with multiple-panel switch of the image viewer ([#1676](https://github.com/CARTAvis/carta-frontend/issues/1676)).
* Fixed issue with the reset button in the spectral line query widget ([#1741](https://github.com/CARTAvis/carta-frontend/issues/1741)).
* Fixed issue with catalog SIMBAD query after cancelling ([#1750](https://github.com/CARTAvis/carta-frontend/issues/1750)).
* Fixed extra catalog overlay sources at the origin ([#1823](https://github.com/CARTAvis/carta-frontend/issues/1823)).

## [3.0.0-beta.2]

### Added
* Added optional usage collection / telemetry [(#637)](https://github.com/CARTAvis/carta-frontend/issues/637).
* Added ability to list files filtered by extension (rather than content) or list all files ([#1](https://github.com/CARTAvis/carta/issues/1)).
* Added two spectral matching types "Vacuum wavelength" and "Air wavelength."
* Circular/linear polarizations are supported in polarization dropdowns for saving subimages and generating hypercubes.
* The ability to export high resolution png images for publication quality in journals.
* The ability to use a custom rest frequency for spectral matching, spectral axis display, and PV image x/y axis display.
* Added new feature: ability to generate a position-velocity (PV) image from a line region on images with a supported coordinate system. The generated images are loaded as separate images, similar to generated moment maps.
### Changed
* Applied a new approach to calculate the sizes and lengths of a region ([#1572](https://github.com/CARTAvis/carta-frontend/issues/1572)).
### Fixed
* Fixed crash when opening the image view configuration dialog before opening an image [(#1705)](https://github.com/CARTAvis/carta-frontend/issues/1705).
* Fixed panning and zooming when opening a new image in distance measuring mode [(#1665)](https://github.com/CARTAvis/carta-frontend/issues/1665).
* Fixed incorrect color gradient of the colorbar ([#1717](https://github.com/CARTAvis/carta-frontend/issues/1717) and [#1718](https://github.com/CARTAvis/carta-frontend/issues/1718)).

## [3.0.0-beta.1b]

### Fixed
* Fixed crash caused by missing region length calculation.

## [3.0.0-beta.1]

### Added
* The image view toolbar can be minimized to prevent it from hiding the image view.
* The last used directory can now be preserved across CARTA sessions.
* The ability to view multiple images at once in a multi-panel view has been added.
* Boolean columns are now supported in FITS and VOTable catalogs.
* Line and poly-line regions can be created. They currently do not have any associated analytic features, but will be used for upcoming PV image features.
* Additional preferences added: smooth updates of the overlay and adjusting the visibility of the cursor overlay.
* The image, region and Stokes value can now be changed on the spatial profiler.
* Multiple images can now be loaded via query parameters, using `?files=[a,b,c]`.
* The Stokes value can be changed on statistics and histogram widgets.
* A cursor widget has been added, which displays the cursor position and value for all open images.
* An experimental JavaScript-based code snippets feature has been added, for scripting CARTA from the frontend. Snippets can be saved, edited and re-executed. The feature can be enabled in the preferences dialog.
* Added a customizable colorbar to the image view widget, with an interactive mode that highlights pixels above a threshold.
* A pixel grid is now displayed at high zoom levels. This can be disabled in the image view settings.
### Changed
* The image overlay title can now be customised on a per-image basis.
* The polarization string (e.g. "Stokes I") is shown instead of the index (e.g. 0).
* The spectral line query widget now checks the Splatalogue server before displaying.
* Optimizations to catalog rendering with a large number of data points.
* Directories displayed in the file browser now have item count and modified date entries. 
### Fixed
* Fixed issue with spectral-matched images not being refreshed [(#1571)](https://github.com/CARTAvis/carta-frontend/issues/1571).
* Fixed issue with image tiles smaller than 4x4 pixels ([#1365](https://github.com/CARTAvis/carta-frontend/issues/1365) and [#1485](https://github.com/CARTAvis/carta-frontend/issues/1485)).
* Fixed crash when region list is initially too small [(#1598)](https://github.com/CARTAvis/carta-frontend/issues/1598).
* Fixed region offset errors when matching and unmatching images [(#1293)](https://github.com/CARTAvis/carta-frontend/issues/1293).
* Fixes progress indicator when displaying multiple spectral profiles [(#1429)](https://github.com/CARTAvis/carta-frontend/issues/1429)
* Fixed minor input issues with the catalog widget ([#1505](https://github.com/CARTAvis/carta-frontend/issues/1505) and [#1544](https://github.com/CARTAvis/carta-frontend/issues/1544)).
* Fixed minor rendering issues on image edges [(#666)](https://github.com/CARTAvis/carta-frontend/issues/666).
* Fixed anchor rendering issue with rotated regions [(#1208)](https://github.com/CARTAvis/carta-frontend/issues/1208).

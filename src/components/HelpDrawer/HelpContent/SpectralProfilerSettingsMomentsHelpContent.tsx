export const SPECTRAL_PROFILER_SETTINGS_MOMENTS_HELP_CONTENT = (
    <div>
        <h3>Moments</h3>
        <p>
            Moment images can be generated and viewed with CARTA. The <b>Moments</b> tab provides several control parameters to define how moment images are calculated, including:
        </p>
        <ul>
            <li>
                <b>Image</b>: the image file for moment calculations. &quot;Active&quot; refers to the image displayed in the Image Viewer if it is in single-panel mode. If it is in multi-panel mode, the active image is highlighted with a
                red box.
            </li>
            <li>
                <b>Region</b>: a region can be selected so that moment calculations are limited inside the region. &quot;Active&quot; refers to the selected region in the Image Viewer. If no region is selected, the full image is included in
                the moment calculations.
            </li>
            <li>
                <b>Coordinate, System, and Range</b>: the spectral range (e.g., velocity range) used for moment calculations is defined with these options. The range can be defined either via the input fields, or via the cursor by dragging
                horizontally in the Spectral Profiler Widget.
            </li>
            <li>
                <b>Mask and Range</b>: these options define a pixel value range used for moment calculations. If the <b>Mask</b> is &quot;None&quot;, all pixels are included. If the <b>Mask</b> is &quot;Include&quot; or &quot;Exclude&quot;,
                the pixel value range defined in the text input fields is included or excluded, respectively. Alternatively, you can define the pixel value range with the cursor by dragging vertically in the Spectral Profiler Widget.
            </li>
            <li>
                <b>Moments</b>: which moment images to be calculated are defined here. Supported options are:
                <ul>
                    <li>-1: Mean value of the spectrum</li>
                    <li>0: Integrated value of the spectrum</li>
                    <li>1: Intensity weighted coordinate</li>
                    <li>2: Intensity weighted dispersion of the coordinate</li>
                    <li>3: Median value of the spectrum</li>
                    <li>4: Median coordinate</li>
                    <li>5: Standard deviation about the mean of the spectrum</li>
                    <li>6: Root mean square of the spectrum</li>
                    <li>7: Absolute mean deviation of the spectrum</li>
                    <li>8: Maximum value of the spectrum</li>
                    <li>9: Coordinate of the maximum value of the spectrum</li>
                    <li>10: Minimum value of the spectrum</li>
                    <li>11: Coordinate of the minimum value of the spectrum</li>
                </ul>
            </li>
        </ul>
        <p>
            When all the parameters are defined, click the <b>Generate</b> button to start the moment image calculations. Depending on the file size, moment calculations may take a while. If that happens, you may wish to cancel the
            calculations via the <b>Cancel</b> button and re-define a proper region and/or spectral range.
        </p>
        <p>
            Once moment images are generated, they will be loaded and displayed in the Image viewer. They are named as <code>$image_filename.moment.$keyword</code>. For example, if moment 0, 1 and 2 images are generated from{" "}
            <code>image M51.fits</code>, they will be named as <code>M51.fits.moment.integrated</code>, <code>M51.fits.moment.weighted_coord</code>, and <code>M51.fits.moment.weighted_dispersion_coord</code>, respectively. These images are
            kept in memory per session and if there is a new request for moment calculations, these images will be deleted first, unless the <b>Keep previous moment image(s)</b> toggle is enabled. Optionally, calculated moment images can be
            exported in CASA or FITS format via <b>File -&gt; Save Image</b>.
        </p>
    </div>
);

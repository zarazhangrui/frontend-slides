# PPT Conversion Reference

Use this reference only when the user provides a PowerPoint file or asks to convert PPT/PPTX into a Frontend Slides HTML deck.

## Conversion Workflow

1. **Extract**
   ```bash
   python scripts/extract-pptx.py <input.pptx> <output_dir>
   ```
   If `python-pptx` is missing, install it:
   ```bash
   python -m pip install python-pptx
   ```

2. **Inspect the extraction output**
   - Read `<output_dir>/extracted-slides.json`.
   - Use `slides[*].title`, `slides[*].content`, `slides[*].images`, `slides[*].tables`, `slides[*].charts`, `slides[*].notes`, and `slides[*].shapes`.
   - Treat `slide_size` and each shape `geometry` as layout clues, not mandatory pixel-perfect constraints.

3. **Summarize for the user before redesign**
   - Report slide count.
   - List each slide title or first meaningful phrase.
   - Mention image/table/chart counts.
   - Ask for confirmation only when content extraction is ambiguous or incomplete.

4. **Run normal style discovery**
   - Continue to Phase 2 in `SKILL.md`.
   - Generate three real title-slide previews using the extracted content, not placeholder copy.
   - Do not show template names or internal labels on the preview slides.

5. **Generate the final HTML deck**
   - Preserve all extracted text unless the user approves editing.
   - Preserve slide order unless the user asks for restructuring.
   - Use extracted images from `assets/`.
   - Convert speaker notes into HTML comments near the related slide.
   - Convert tables into designed slide-native table/card layouts.
   - Convert chart data into CSS/SVG/HTML visualizations when feasible; otherwise summarize the chart clearly and preserve the original chart image if available.
   - If one PowerPoint slide is too dense for a fixed 1920×1080 stage, split it into multiple HTML slides and note the split.

## Layout Interpretation

The extractor records geometry in EMUs, approximate pixels, and inches. Use it to understand hierarchy:

- Larger/upper text boxes usually indicate titles.
- Repeated left/top positions often indicate a template grid.
- High z-order can indicate overlay labels, annotations, or callouts.
- Image coordinates help preserve intended visual relationships.

Do not blindly recreate PowerPoint chrome if it is weak. Frontend Slides should preserve content and intent while improving design quality.

## Quality Checks

After generation:

- Verify every slide remains inside the fixed 1920×1080 stage.
- Check screenshots at 1280×720 and at least one phone viewport.
- Confirm no text overflows, panels overlap, or images stretch incorrectly.
- Confirm image paths are relative and load from the generated HTML location.
- Confirm speaker notes are preserved as comments if notes existed.

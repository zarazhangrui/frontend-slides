# Distillery Team Directory

Source of truth for the **team / people slide** (template T7) lookup. When a user provides comma-separated names in Phase 1, the skill matches each name (case-insensitive) against the **Name** column and pulls the row's email, role, bio, and photo.

If a name isn't found here:
1. Construct email as `firstname.lastname@distillery.com` (lowercase, multi-word last names concatenated — e.g. `hector.dediego`).
2. Render an initials avatar (cyan ring, navy bg, white initials) instead of a photo.
3. Print a non-blocking warning: `team directory: "<name>" not found — using initials avatar. Drop a photo at assets/team/<slug>.jpg and add a row to team.md.`

To add a person: append a row, drop a square JPEG (≥256px) at the listed Photo path, run any image through quality ~88 JPEG.

| Name              | Email                              | Role                                 | Bio                                                                                  | Photo                              |
|-------------------|------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------|------------------------------------|
| Francisco Maurici | francisco.maurici@distillery.com   | Head of Delivery                     | Leading delivery at Distillery, helping technical leaders ship purpose-fit projects. | assets/team/francisco-maurici.jpg  |
| Laura Taricco     | laura.taricco@distillery.com       | Recruitment Lead                     | Recruitment Lead at Distillery.                                                      | assets/team/laura-taricco.jpg      |
| Tomas Calusio     | tomas.calusio@distillery.com       | Head of Operations                   | Head of Operations at Distillery.                                                    | assets/team/tomas-calusio.jpg      |
| Paola Cervera     | paola.cervera@distillery.com       | HR Lead                              | HR Lead at Distillery.                                                               | assets/team/paola-cervera.jpg      |
| Hector De Diego   | hector.dediego@distillery.com      | Mobile and DevOps Head of Department | Mobile and DevOps Head of Department at Distillery.                                  | assets/team/hector-dediego.jpg     |
| Emanuel Paz       | emanuel.paz@distillery.com         | Data Head of Department              | Data Head of Department at Distillery.                                               | _(no photo yet — use initials)_    |
| Matias Beccacece  | matias.beccacece@distillery.com    | PDM Head of Department               | PDM Head of Department at Distillery.                                                | assets/team/matias-beccacece.jpg   |
| Nicolas Silvestre | nicolas.silvestre@distillery.com   | QA Head of Department                | QA Head of Department at Distillery.                                                 | assets/team/nicolas-silvestre.jpg  |
| Lela McCrea       | lela.mccrea@distillery.com         | VP of Client Success                 | VP of Client Success at Distillery.                                                  | assets/team/lela-mccrea.jpg        |
| Ethan Cole        | ethan.cole@distillery.com          | Growth Director                      | Growth Director at Distillery.                                                       | assets/team/ethan-cole.jpg         |
| Raquelle Desimone | raquelle.desimone@distillery.com   | Growth Director                      | Growth Director at Distillery.                                                       | assets/team/raquelle-desimone.jpg  |
| Andrey Kudievskiy | andrey.kudievskiy@distillery.com   | CEO                                  | CEO at Distillery.                                                                   | assets/team/andrey-kudievskiy.jpg  |

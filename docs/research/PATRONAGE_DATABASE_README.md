# Patronage Catalog Database

Files:

- `patronage_catalog.sql` is the canonical schema and seed.
- `patronage_catalog.sqlite` is the built SQLite database.
- `MEDIEVAL_RENAISSANCE_PATRONAGE_SOURCEBOOK.md` explains the thick-entry style and game translation rules.

Rebuild:

```powershell
Remove-Item .\docs\research\patronage_catalog.sqlite
& 'C:\Android\android-sdk\platform-tools\sqlite3.exe' .\docs\research\patronage_catalog.sqlite ".read docs/research/patronage_catalog.sql"
```

Useful queries:

```sql
SELECT COUNT(*) FROM patrons;

SELECT display_name, life_dates, geography, domain_tags, suggested_glyphs
FROM v_card_candidates
WHERE research_priority = 'critical';

SELECT display_name, life_dates, centers, summary
FROM patrons
WHERE domain_tags LIKE '%alchemy%'
ORDER BY active_start;

SELECT display_name, geography, domain_tags
FROM patrons
WHERE gender = 'female'
ORDER BY active_start;

SELECT display_name, suggested_glyphs, summary
FROM patrons
WHERE suggested_glyphs LIKE '%mercury%'
ORDER BY significance_tier, active_start;

SELECT patron, related_name, relationship_type, game_mechanic_hook
FROM v_relationship_prompts
WHERE patron = 'Cosimo de'' Medici';

SELECT patron, related_name, works_or_projects, relationship_dynamics
FROM v_relationship_prompts
WHERE related_type IN ('scientist','philosopher','translator')
ORDER BY patron;
```

Catalog statuses:

- `candidate`: included as a significant documented patron, not yet fully sourced.
- `sourced`: has starter sources and is ready for thick-description work.
- `thick-entry`: has an academic-style encyclopedia entry.
- `carded`: has a playable Glass Bead Game card.
- `deferred`: relevant to patronage networks but maybe better modeled as an agent, artist, scholar, or cultural mediator.

Significance tiers:

- `1`: canonical, high-value patron for the game and research corpus.
- `2`: major patron, likely worth a thick entry after tier 1.
- `3`: useful context or regional coverage.
- `4`: marginal or special-case candidate.

Expansion protocol:

1. Add new patrons to `patronage_catalog.sql`, not directly to the SQLite file.
2. Use stable IDs like `patron-isabella-deste`.
3. Keep `summary` factual and short; save interpretation for the thick entry.
4. Put game-facing tags in `suggested_glyphs`, `alchemical_read`, and `game_hooks`.
5. Mark uncertain figures as `documentation_level='needs review'` or `catalog_status='deferred'`.
6. Rebuild the SQLite database after editing the SQL seed.

The current seed is intentionally inclusive across medieval, Renaissance, and early modern patronage systems. It is a working research catalog, not a final canon.

## Patron Relationships

`patron_relationships` tracks the concrete human/institutional relationships that should drive game prompts when a patron bead and a creator/scholar/scientist bead are placed near each other.

Examples already seeded:

- Cosimo de' Medici + Marsilio Ficino: house/villa near Careggi, Greek Plato manuscripts, translation task.
- Isabella d'Este + Perugino: more than seventy letters, contract, explicit iconographic control.
- Cosimo II de' Medici + Galileo: `Sidereus Nuncius`, Medicean Stars, court mathematician/philosopher status.
- Rudolf II + Tycho Brahe + Kepler: court astronomy, data, and the `Rudolphine Tables`.
- Frederick II of Denmark + Tycho Brahe: Hven land grant and Uraniborg.
- Julius II + Michelangelo/Raphael/Bramante: conflictual papal megaproject patronage.
- Akbar + Abu'l-Fazl/translation atelier/painting atelier: imperial history, translation, and workshop systems.

Important fields:

- `relationship_type`: commission, office, residence gift, salary, workshop, dedication, negotiation, etc.
- `support_material`: what the patron actually supplied.
- `works_or_projects`: object, text, building, institution, observatory, festival, or collection.
- `relationship_dynamics`: thick-description interpretation of how the relationship worked.
- `game_mechanic_hook`: prompt text or system behavior for bead adjacency.
- `confidence`: use `medium` or `needs review` when the relationship is useful but legendary, contested, or over-simplified.

Future implementation idea: when a patron card and an artist/philosopher/scientist card are both on the board, query `v_relationship_prompts` by names or future entity IDs and surface the `game_mechanic_hook` as an optional move.

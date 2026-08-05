# AiRecommendationCard plan

Agent suggestion with a confidence meter and alternatives, ported from the Beautiful UI "Recommendation Card" primitive.

## Contract

- Props: `title`, `segments` (`AiRecommendationSegment[]`), `confidence` (`high` | `medium` | `low`), `alternatives`, `acceptLabel`, `alternativesLabel`, `showConfidence`, `labels`, `ariaLabel`.
- Events: `accept`, `alternatives`, `alternative-select` (`AiRecommendationAlternative`).
- Host: `data-confidence` attribute, `data-has-alternatives` flag, `aria-label`.

## Behavior

- The body renders inline code fragments from segments; alternatives show a signal badge (review / none / good).
- The confidence meter fills by level and colors green / orange / red.
- Accept and Alternatives are notifications; selecting an alternative emits the full alternative object.

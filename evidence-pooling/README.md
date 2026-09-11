# Evidence pooling in Transit — a small experiment inspired by EviQE

Transit retrieves evidence for a question with a single TF-IDF + cosine-similarity
pass over the source paper's 14 chunks. That works well when the question's
wording overlaps with the paper's own vocabulary, but a single query vector is
a narrow lens: it can only pull in chunks that share terms with *that one*
phrasing of the question.

Le, Bigdeli, Seyedsalehi, Zihayat & Bagheri's **EviQE** (CIKM 2026) studies a
related question at a much larger scale: for LLM-based query expansion, is it
better to pool the documents retrieved by *several different reformulations*
of a query and select from that pool, rather than lean on one (possibly more
sophisticated) reformulation? They find that pooling consistently improves
relevant-document coverage across TREC DL and BEIR benchmarks, and that once
good evidence is identified, further reformulation iterations add little.

This script asks the same question at Transit's scale.

## Method

For 5 test questions, each phrased more loosely than the paper's own wording:

- **Baseline** — run Transit's existing `retrieve()` once, on the question as
  originally phrased, top-4 (the same budget the UI uses).
- **Pooled** — run `retrieve()` on the original question *and* two
  differently-worded reformulations (each leaning toward the vocabulary of a
  different relevant chunk), take each chunk's best score across the three
  runs, and keep the top-4 overall — the same final budget as the baseline,
  just sourced from three retrieval passes instead of one.

`retrieval.js` is copied verbatim from `public/index.html`, so both strategies
use the exact retriever Transit ships with, not a re-implementation of it.

Each question was hand-labelled with the chunks it should surface ("gold"),
based on reading the 14 chunks directly. Effectiveness is recall: the fraction
of gold chunks that appear in a strategy's top-4.

## Results

| Question       | Gold sections                                               | Baseline recall | Pooled recall |
|----------------|--------------------------------------------------------------|:---:|:---:|
| layers         | AIoT Architecture Layers, LLM Integration Layer, Edge–Cloud Collaboration | 0.00 | 0.67 |
| scaling        | Technical Challenges, Evaluation Metrics                     | 1.00 | 1.00 |
| limitations    | AIoT Limitations, LLM Limitations                             | 0.00 | 1.00 |
| methodology    | Methodology, Abstract                                         | 0.00 | 1.00 |
| future-ethics  | Future Research Directions, Ethical and Privacy Issues        | 0.50 | 1.00 |
| **Average**    |                                                                | **0.30** | **0.93** |

Run it yourself:

```bash
node evidence-pooling.js
```

## Limitations — read before citing this anywhere

This is a small, illustrative check, not a benchmark result:

- **14 chunks, one document.** EviQE evaluates on TREC DL and BEIR, corpora
  with thousands of documents. Recall differences at this scale are far
  easier to produce and far less informative than at corpus scale.
- **5 hand-picked questions.** They were chosen specifically because their
  gold chunks use different vocabulary than a loosely-phrased question, i.e.
  to be cases where pooling *should* help.
- **Reformulations are hand-written, not LLM-generated.**
- **Gold labels are self-assigned**, based on reading the 14 chunks.

## Reference

Le, H. S., Bigdeli, A., Seyedsalehi, S., Zihayat, M., & Bagheri, E. (2026).
EviQE: Evidence Selection for LLM-Based Query Expansion. *Proceedings of the
ACM International Conference on Information and Knowledge Management (CIKM
2026)*.

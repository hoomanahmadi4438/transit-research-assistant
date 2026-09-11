/**
 * retrieval.js
 *
 * Extracted verbatim (chunks + TF-IDF/cosine-similarity logic) from
 * Transit's public/index.html, so this experiment uses exactly the
 * same retrieval implementation as the deployed app — not a
 * re-approximation of it.
 */

/* ============ Paper corpus, chunked by section ============ */
const CHUNKS = [
  { section: "Abstract", text: "Rapid urbanization and the limited ability of transportation infrastructure to expand have intensified traffic congestion, shortages in public transit services, and rising air pollution in cities. This study presents a systematic review of how the combined use of the Artificial Intelligence of Things (AIoT) and Large Language Models (LLMs) can help address these challenges by supporting more adaptive and data-driven approaches to urban mobility management. The integration of connected vehicles, IoT-based sensing systems, and LLM-supported reasoning enables continuous information exchange that can improve congestion prediction, reduce fuel use, and lower environmental impacts. The review identifies key barriers including the absence of alternative routes in highly congested corridors and a shortage of specialists who can translate AI-generated insights into practical operational strategies." },
  { section: "AIoT Fundamentals", text: "Artificial Intelligence of Things refers to the integration of artificial intelligence techniques with Internet of Things infrastructures to enable local processing, real-time perception, and automated responses. In contrast to conventional IoT systems that primarily focus on data collection and transmission, AIoT embeds analytical capabilities within devices, gateways, and network layers. AIoT architectures in urban transport are typically organized around sensing, communication, edge processing, and cloud analytics layers. Common AIoT applications include short-term congestion prediction, traffic flow monitoring, dynamic routing, and predictive maintenance of transport infrastructure and vehicle fleets." },
  { section: "AIoT Limitations", text: "Existing studies consistently report limitations associated with AIoT-based transport systems: rapid growth in data volume places pressure on communication bandwidth and processing resources, especially in dense urban areas. Many edge devices operate under strict energy and hardware constraints, limiting the complexity of models deployed locally. Ensuring privacy, security, and interoperability across devices, vendors, and agencies remains a persistent challenge. Current AIoT implementations are often optimized for detection, monitoring, and control tasks rather than higher-level interpretation or decision support." },
  { section: "Large Language Models in Transport", text: "Large Language Models are built on transformer architectures that capture long-range dependencies and complex relationships within large-scale datasets. In transportation research, LLMs have attracted attention because many operational and planning processes rely on textual or semi-structured information — incident reports, maintenance records, policy documents, and user feedback. LLMs can process such information to identify recurring patterns, support classification, and produce concise summaries that assist human operators and planners. Multimodal LLMs can support tasks such as interpreting traffic images and associating sensor anomalies with descriptive context." },
  { section: "LLM Limitations", text: "The literature repeatedly highlights important limitations of LLMs: their computational and energy requirements remain substantial, raising concerns about scalability and cost when deployed at scale. Another widely discussed issue is hallucination, where outputs may appear coherent but lack factual grounding — in transport applications where decisions affect safety, this limits the degree to which LLMs can be used without human oversight. Techniques such as fine-tuning, prompt design, and retrieval-based mechanisms are commonly discussed as ways to improve reliability and contextual relevance, though these adaptations increase system complexity and maintenance effort." },
  { section: "Taxonomy of Applications", text: "Applications of AI in smart urban transport can be organized into three categories. The first includes AIoT-based applications focused on operational sensing and control — traffic flow monitoring, congestion detection, adaptive signal control — where intelligence is embedded at the device or edge level for fast, low-latency reactions. The second consists of LLM-centered applications for processing textual information, supporting summarization, classification, and decision support, emphasizing interpretation and human communication rather than real-time control. The third category captures integrated AIoT–LLM applications, where AIoT provides continuous situational awareness while LLMs analyze aggregated information and support coordinated, system-level decision-making." },
  { section: "AIoT Architecture Layers", text: "AIoT-based smart transport systems are structured around a layered architecture. The device layer includes sensors, cameras, and embedded modules that collect raw data on speed, flow, occupancy, and environmental conditions. The communication layer aggregates sensor streams and supports connectivity between vehicles, roadside units, and control centers. The data processing layer combines edge and cloud computing: edge nodes perform time-sensitive processing for adaptive signal control and incident detection, while cloud platforms support large-scale storage, long-term analysis, and model training. The application layer delivers outputs like traffic dashboards and real-time routing services." },
  { section: "LLM Integration Layer", text: "The LLM integration layer introduces a reasoning and interpretation component into AIoT-enabled systems, transforming aggregated data into coherent, context-aware insights. Deployment strategies vary: cloud-based deployment supports complex analytical tasks such as system-wide assessment, while edge-level deployment uses lightweight or compressed models for time-sensitive applications with limited scope. Hybrid approaches combine both — enabling rapid local responses while reserving intensive reasoning for centralized platforms. Retrieval-based mechanisms allow models to access up-to-date information during inference rather than relying solely on pre-trained knowledge, and prompt design plays a central role in producing consistent, reviewable outputs." },
  { section: "Edge–Cloud Collaboration", text: "Effective integration of AIoT and LLMs depends on a clear division of responsibilities between edge and cloud environments. At the edge, processing occurs close to data sources — sensors, vehicles, roadside units — enabling low-latency responses for incident detection and adaptive signal control while reducing communication overhead. Cloud computing complements this by supporting large-scale storage, historical trend analysis, and system-wide optimization. Coordination is often implemented through adaptive offloading strategies, where tasks are dynamically assigned to edge or cloud resources based on latency tolerance, computational load, and network conditions." },
  { section: "Evaluation Metrics", text: "Evaluating AIoT- and LLM-enabled transport systems requires combining quantitative indicators with qualitative judgement, since performance emerges from interactions across sensing, communication, computation, and decision-support layers. LLM evaluation focuses on correctness, completeness, contextual alignment, reasoning quality, explainability, and consistency across repeated queries. AIoT and ITS performance metrics focus on latency, responsiveness, reliability under fluctuating conditions, and scalability to city-wide deployments. A recurring issue is the absence of shared benchmarks for integrated AIoT–LLM systems, since many evaluations rely on custom scenarios or simulations that are difficult to compare across studies." },
  { section: "Technical Challenges", text: "One of the most frequently reported technical challenges relates to real-time data processing at scale, given continuous streams of heterogeneous data from sensors, cameras, and connected vehicles. Scalability is closely linked: systems that perform well in limited testbeds often degrade when extended to city-wide deployments as communication overhead and coordination complexity grow. Integrating heterogeneous data and system components from different vendors is non-trivial. The deployment of LLMs introduces additional constraints — high computational and energy requirements limit where models can be executed, particularly in edge-based or latency-sensitive applications." },
  { section: "Ethical and Privacy Issues", text: "The increasing reliance on AIoT infrastructures raises important ethical and privacy concerns, since continuous collection of mobility-related data — including location traces and travel behavior — creates risk of unintended surveillance when aggregated across large populations. Even anonymized data sources can enable re-identification when combined. Ethical questions also arise from learning-based models reflecting biases in training data, which can influence how incidents are interpreted or services recommended, potentially causing uneven impacts across neighborhoods or user groups." },
  { section: "Future Research Directions", text: "Research on AIoT and LLMs in smart urban transport is still at an early stage of maturity. Key future directions include tighter integration of real-time sensing with higher-level reasoning through adaptive edge–cloud coordination; development of standardized evaluation frameworks that combine operational performance, reasoning quality, and infrastructure constraints; deeper study of human–system interaction to understand how operators and planners trust AI-generated outputs; and longitudinal, cross-city studies to assess long-term reliability and institutional adaptation beyond short-term pilot projects." },
  { section: "Methodology", text: "A systematic literature review was adopted, examining studies published between 2016 and 2025 across major academic databases including IEEE Xplore, Scopus, Web of Science, ScienceDirect, SpringerLink, and Wiley Online Library. The review initially retrieved 230 records; after title screening, duplicate removal, abstract screening, and full-text quality assessment against inclusion criteria focused on relevance to urban transport and use of AIoT- or LLM-based approaches, 42 studies were selected for full-text analysis, ensuring transparency and methodological consistency." }
];

/* ============ Lightweight TF-IDF retrieval (client-side, no libraries) ============ */
function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
}

const STOPWORDS = new Set(['the','and','for','are','with','that','this','from','have','has','can','their','these','into','such','not','was','were','which','also','its','more','than','they','when','all','use','used','using','via','how','what','why','does']);

function buildIndex(chunks) {
  const docsTokens = chunks.map(c => tokenize(c.text).filter(w => !STOPWORDS.has(w)));
  const df = {};
  docsTokens.forEach(tokens => {
    new Set(tokens).forEach(t => df[t] = (df[t] || 0) + 1);
  });
  const N = chunks.length;
  const idf = {};
  Object.keys(df).forEach(t => idf[t] = Math.log((N + 1) / (df[t] + 0.5)) + 1);
  return { docsTokens, idf };
}

function vectorize(tokens, idf) {
  const tf = {};
  tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
  const vec = {};
  Object.keys(tf).forEach(t => { if (idf[t]) vec[t] = tf[t] * idf[t]; });
  return vec;
}

function cosineSim(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  Object.keys(vecA).forEach(k => { normA += vecA[k] ** 2; if (vecB[k]) dot += vecA[k] * vecB[k]; });
  Object.keys(vecB).forEach(k => normB += vecB[k] ** 2);
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const INDEX = buildIndex(CHUNKS);

function retrieve(query, k = 4) {
  const qTokens = tokenize(query).filter(w => !STOPWORDS.has(w));
  const qVec = vectorize(qTokens, INDEX.idf);
  const scored = CHUNKS.map((chunk, i) => {
    const dVec = vectorize(INDEX.docsTokens[i], INDEX.idf);
    return { ...chunk, score: cosineSim(qVec, dVec) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0).slice(0, k);
}

module.exports = { CHUNKS, retrieve };

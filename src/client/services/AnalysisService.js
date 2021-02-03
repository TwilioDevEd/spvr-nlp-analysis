export default class AnalysisService {
  constructor(url) {
    this.url = url;
  }

  async retrieve() {
    const response = await fetch(`/api/analysis?url=${this.url}`);
    const results = await response.json();

    return results;
  }
}

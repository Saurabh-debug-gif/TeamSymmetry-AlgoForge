def generate_training_content(text):
    sentences = text.split(".")
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]

    # Keyword scoring — prioritise SOP-relevant sentences
    keywords = ["must", "required", "storage", "dispense", "safety",
                 "never", "avoid", "mandatory", "critical", "procedure",
                 "ensure", "verify", "temperature", "dosage", "sterile"]

    def score_sentence(sentence):
        lower = sentence.lower()
        return sum(word in lower for word in keywords)

    scored_sentences = sorted(
        [(score_sentence(s), s) for s in sentences],
        key=lambda x: x[0],
        reverse=True
    )

    top_sentences = [s for _, s in scored_sentences]

    # Basic paragraph — top 3 highest-scoring sentences
    basic_paragraph = ". ".join(top_sentences[:3])

    # Bullet learning — top 5 highest-scoring sentences
    bullet_learning = top_sentences[:5]

    # Critical alerts — sentences containing warning keywords
    critical_alerts = []
    for s in sentences:
        lower = s.lower()
        if any(word in lower for word in [
            "must",
            "never",
            "avoid",
            "required",
            "mandatory",
            "critical"
        ]):
            critical_alerts.append(f"⚠️ {s}")

    # Quick summary — top 2 highest-scoring sentences
    quick_summary = ". ".join(top_sentences[:2])

    return {
        "basic_paragraph": basic_paragraph,
        "bullet_learning": bullet_learning,
        "critical_alerts": critical_alerts[:4],
        "quick_summary": quick_summary
    }
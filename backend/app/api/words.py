import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.word import Word, UserProgress, WordCategory, DifficultyLevel, LearningStatus
from app.models.user import User
from app.schemas.schemas import WordOut, WordWithProgress, WordCreate

router = APIRouter()

# ─── Seed helper (called once) ────────────────────────────────────────────────
SEED_WORDS = [
    {"word": "Entropía", "slug": "entropia", "simple_definition": "La tendencia natural de los sistemas a desorganizarse con el tiempo.", "advanced_definition": "En termodinámica, la entropía es una medida del desorden o aleatoriedad de un sistema. El segundo principio de la termodinámica establece que la entropía de un sistema aislado siempre tiende a aumentar, lo que implica que los procesos espontáneos son irreversibles.", "category": "science", "difficulty": "advanced", "examples": '["El hielo se derrite espontáneamente a temperatura ambiente, aumentando la entropía.", "El universo tiende hacia el máximo desorden: la muerte térmica cósmica.", "Una habitación desordenada tiene mayor entropía que una ordenada."]', "etymology": "Del griego ἐντροπία (entropía), 'transformación'. Acuñado por Rudolf Clausius en 1865.", "related_words": '["termodinámica", "caos", "orden", "energía", "sistema"]', "phonetic": "/en.tro.ˈpi.a/"},
    {"word": "Epistemología", "slug": "epistemologia", "simple_definition": "El estudio filosófico de cómo sabemos lo que sabemos.", "advanced_definition": "Rama de la filosofía que investiga el origen, la naturaleza, los métodos y los límites del conocimiento humano. Se pregunta qué es el conocimiento, cómo se adquiere, cuáles son sus fundamentos y qué distingue la creencia justificada de la opinión.", "category": "philosophy", "difficulty": "expert", "examples": '["¿Cómo sabemos que el mundo externo existe?", "La epistemología examina si la ciencia produce conocimiento verdadero.", "Platón definió el conocimiento como creencia verdadera justificada."]', "etymology": "Del griego ἐπιστήμη (episteme, 'conocimiento') + λόγος (logos, 'estudio').", "related_words": '["filosofía", "conocimiento", "gnoseología", "racionalismo", "empirismo"]', "phonetic": "/e.pis.te.mo.lo.ˈxi.a/"},
    {"word": "Heurística", "slug": "heuristica", "simple_definition": "Estrategia mental práctica para resolver problemas rápidamente.", "advanced_definition": "En psicología cognitiva, las heurísticas son atajos mentales o reglas prácticas que simplifican la toma de decisiones bajo incertidumbre. Aunque generalmente eficientes, pueden conducir a sesgos sistemáticos (Kahneman y Tversky, 1974).", "category": "psychology", "difficulty": "intermediate", "examples": '["Usamos heurísticas cuando elegimos un restaurante por su apariencia sin leer reseñas.", "Un médico usa heurísticas de diagnóstico basadas en síntomas más comunes.", "El pensamiento rápido de Kahneman describe el sistema heurístico."]', "etymology": "Del griego εὑρίσκω (heurisko, 'descubrir'). Raíz de '¡Eureka!'", "related_words": '["sesgo cognitivo", "intuición", "razonamiento", "toma de decisiones"]', "phonetic": "/eu.ˈris.ti.ka/"},
    {"word": "Paradigma", "slug": "paradigma", "simple_definition": "El modelo o marco mental dominante desde el que entendemos el mundo.", "advanced_definition": "Concepto popularizado por Thomas Kuhn en 'La estructura de las revoluciones científicas' (1962). Un paradigma es el conjunto de supuestos, valores y prácticas que constituyen una forma de ver el mundo y practicar la ciencia en un periodo histórico dado.", "category": "science", "difficulty": "intermediate", "examples": '["El paso de la física newtoniana a la relatividad de Einstein fue un cambio de paradigma.", "El modelo geocéntrico fue el paradigma dominante durante siglos.", "Internet creó un nuevo paradigma de comunicación global."]', "etymology": "Del griego παράδειγμα (paradeigma, 'modelo, ejemplo').", "related_words": '["revolución científica", "Kuhn", "cosmovisión", "modelo mental"]', "phonetic": "/pa.ˈra.ðiɣ.ma/"},
    {"word": "Sinergia", "slug": "sinergia", "simple_definition": "Cuando el resultado de la cooperación es mayor que la suma de sus partes.", "advanced_definition": "En sistemas complejos, la sinergia describe el fenómeno en que elementos interactuantes producen un resultado superior a la suma de sus efectos individuales (1+1>2). Fundamental en biología, economía, gestión empresarial y teoría de sistemas.", "category": "science", "difficulty": "intermediate", "examples": '["Un equipo diverso produce ideas que ningún miembro hubiera tenido solo.", "Las células forman tejidos con propiedades que no poseen de forma individual.", "La colaboración entre empresas puede crear valor que ninguna generaría sola."]', "etymology": "Del griego συνεργία (synergia, 'cooperación'), syn- 'juntos' + ergon 'trabajo'.", "related_words": '["sistema", "cooperación", "emergencia", "holismo"]', "phonetic": "/si.ˈner.xia/"},
    {"word": "Ontología", "slug": "ontologia", "simple_definition": "La rama filosófica que estudia qué cosas existen y qué significa 'ser'.", "advanced_definition": "Subdisciplina de la metafísica que investiga la naturaleza del ser, la existencia y la realidad. Se pregunta: ¿qué categorías de cosas existen? ¿Qué es una cosa? ¿Pueden existir entidades abstractas como los números?", "category": "philosophy", "difficulty": "expert", "examples": '["¿Los unicornios existen en algún sentido ontológico?", "La ontología de Heidegger pregunta por el ser del Dasein (ser-ahí).", "Debate: ¿los números existen independientemente de las mentes?"]', "etymology": "Del griego ὄν (on, 'ser') + λόγος (logos, 'estudio'). Término acuñado en el siglo XVII.", "related_words": '["metafísica", "existencia", "ser", "realidad", "Heidegger"]', "phonetic": "/on.to.lo.ˈxi.a/"},
    {"word": "Algoritmo", "slug": "algoritmo", "simple_definition": "Una receta paso a paso para resolver un problema.", "advanced_definition": "Secuencia finita, determinada y efectiva de instrucciones que, dado un estado inicial, conduce a un estado final definido. Fundamento de las ciencias de la computación. Los algoritmos pueden analizarse por su complejidad temporal O(n) y espacial.", "category": "technology", "difficulty": "beginner", "examples": '["El GPS usa algoritmos para encontrar la ruta más corta.", "Un algoritmo de búsqueda binaria divide el problema a la mitad en cada paso.", "El PageRank de Google es un algoritmo que mide la importancia de páginas web."]', "etymology": "Del nombre del matemático persa Al-Juarismi (siglo IX), latinizado como 'Algoritmi'.", "related_words": '["complejidad", "programación", "lógica", "computación", "función"]', "phonetic": "/al.ɡo.ˈrit.mo/"},
    {"word": "Catálisis", "slug": "catalisis", "simple_definition": "Acelerar una reacción química usando una sustancia que no se consume en el proceso.", "advanced_definition": "En química, la catálisis es el proceso por el cual una sustancia denominada catalizador aumenta la velocidad de una reacción química al reducir la energía de activación, sin ser consumida en la reacción global. Esencial en procesos industriales y biológicos (enzimas).", "category": "science", "difficulty": "intermediate", "examples": '["Las enzimas son catalizadores biológicos que permiten la digestión.", "Los convertidores catalíticos en autos reducen emisiones contaminantes.", "La catálisis industrial del amoníaco (proceso Haber) produce fertilizantes globales."]', "etymology": "Del griego κατάλυσις (katalysis, 'disolución'), kata- 'abajo' + lyein 'soltar'.", "related_words": '["enzima", "reacción química", "energía de activación", "cinética"]', "phonetic": "/ka.ˈta.li.sis/"},
    {"word": "Dialéctica", "slug": "dialectica", "simple_definition": "El arte del debate en que dos ideas opuestas se confrontan para llegar a una verdad superior.", "advanced_definition": "Método filosófico que describe el proceso de razonamiento mediante la confrontación de tesis y antítesis para alcanzar una síntesis superadora. Desarrollado por Hegel y adaptado por Marx a la historia material (materialismo dialéctico).", "category": "philosophy", "difficulty": "advanced", "examples": '["Tesis: el mercado libre; Antítesis: el comunismo; Síntesis: economía mixta.", "La dialéctica socrática usaba preguntas para refutar creencias falsas.", "Marx usó la dialéctica para analizar el conflicto de clases."]', "etymology": "Del griego διαλεκτική (dialektike, 'arte del diálogo'), de dialegesthai 'conversar'.", "related_words": '["Hegel", "Marx", "tesis", "antítesis", "síntesis", "lógica"]', "phonetic": "/dia.ˈlek.ti.ka/"},
    {"word": "Homeostasis", "slug": "homeostasis", "simple_definition": "La capacidad de un sistema vivo de mantenerse estable ante cambios externos.", "advanced_definition": "Proceso regulatorio por el cual los organismos biológicos mantienen condiciones internas relativamente estables (temperatura corporal, pH sanguíneo, glucosa) mediante mecanismos de retroalimentación negativa, independientemente de las variaciones del entorno.", "category": "science", "difficulty": "intermediate", "examples": '["El cuerpo humano mantiene 37°C mediante la homeostasis térmica.", "El hígado regula los niveles de glucosa en sangre.", "Los ecosistemas buscan el equilibrio homeostático tras perturbaciones."]', "etymology": "Del griego ὅμοιος (homoios, 'similar') + στάσις (stasis, 'estado fijo'). Término de Walter Cannon (1926).", "related_words": '["retroalimentación", "equilibrio", "biología", "termorregulación", "regulación"]', "phonetic": "/ho.me.os.ˈta.sis/"},
]

def seed_words(db: Session):
    if db.query(Word).count() == 0:
        for w in SEED_WORDS:
            word = Word(**w)
            db.add(word)
        db.commit()

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/seed")
def trigger_seed(db: Session = Depends(get_db)):
    """Seed initial words — call once on first deploy."""
    seed_words(db)
    count = db.query(Word).count()
    return {"seeded": True, "total_words": count}

@router.get("/", response_model=List[WordOut])
def list_words(
    category: Optional[WordCategory] = None,
    difficulty: Optional[DifficultyLevel] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Word)
    if category:
        query = query.filter(Word.category == category)
    if difficulty:
        query = query.filter(Word.difficulty == difficulty)
    if search:
        query = query.filter(Word.word.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()

@router.get("/daily", response_model=List[WordWithProgress])
def get_daily_words(
    limit: int = 5,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Return daily words for learning session."""
    seed_words(db)
    words = db.query(Word).order_by(Word.id).limit(limit).all()
    result = []
    for w in words:
        status = None
        if current_user:
            prog = db.query(UserProgress).filter(
                UserProgress.user_id == current_user.id,
                UserProgress.word_id == w.id
            ).first()
            if prog:
                status = prog.status
        result.append(WordWithProgress(**{c.name: getattr(w, c.name) for c in w.__table__.columns}, user_status=status))
    return result

@router.get("/slugs")
def get_all_slugs(db: Session = Depends(get_db)):
    """For Next.js static generation — returns all word slugs."""
    seed_words(db)
    words = db.query(Word.slug).all()
    return [w.slug for w in words]

@router.get("/{slug}", response_model=WordWithProgress)
def get_word_by_slug(
    slug: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    seed_words(db)
    word = db.query(Word).filter(Word.slug == slug).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")

    status = None
    if current_user:
        prog = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.word_id == word.id
        ).first()
        if prog:
            status = prog.status

    return WordWithProgress(**{c.name: getattr(word, c.name) for c in word.__table__.columns}, user_status=status)

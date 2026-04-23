import { useEffect, useMemo, useState } from 'react';
import { LoaderCircle, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type WgerExerciseImage = {
    id: string;
    url: string;
    isMain: boolean;
};

type ExerciseVideo = {
    id: string;
    url: string;
    thumbnailUrl: string | null;
};

type WgerExerciseInfo = {
    id: string;
    name: string;
    description: string;
    images: WgerExerciseImage[];
    videos: ExerciseVideo[];
    bodyPart?: string | null;
    target?: string | null;
    equipment?: string | null;
};

type WgerApiResponse = {
    count: number;
    results: WgerExerciseInfo[];
    message?: string;
};

type ExerciseLibraryModalProps = {
    onClose: () => void;
};

function stripHtml(html: string): string {
    if (typeof window === 'undefined') {
        return html.replace(/<[^>]*>/g, '');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc.body.textContent?.trim() ?? '';
}

export default function ExerciseLibraryModal({
    onClose,
}: ExerciseLibraryModalProps) {
    const [exercises, setExercises] = useState<WgerExerciseInfo[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<WgerExerciseInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadExercises = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/api/exercises/library?limit=30', {
                    signal: controller.signal,
                    headers: {
                        Accept: 'application/json',
                    },
                });

                const data = (await response.json()) as WgerApiResponse;

                if (!response.ok) {
                    throw new Error(
                        data.message ??
                            `Exercise provider request failed with status ${response.status}`,
                    );
                }

                const normalizedResults = (data.results ?? []).map((exercise) => {
                    return {
                        ...exercise,
                        id: exercise.id || crypto.randomUUID(),
                        name: exercise.name?.trim() || 'Unnamed exercise',
                        description: exercise.description?.trim() || '',
                        images: (exercise.images ?? []).filter(
                            (image) => Boolean(image?.url),
                        ),
                        videos: (exercise.videos ?? []).filter(
                            (video) => Boolean(video?.url),
                        ),
                    };
                });

                setExercises(normalizedResults);
            } catch (fetchError) {
                if ((fetchError as Error).name === 'AbortError') {
                    return;
                }

                setError((fetchError as Error).message || 'No se pudo cargar la biblioteca de ejercicios.');
            } finally {
                setIsLoading(false);
            }
        };

        void loadExercises();

        return () => controller.abort();
    }, []);

    const selectedDescription = useMemo(
        () => (selectedExercise ? stripHtml(selectedExercise.description) : ''),
        [selectedExercise],
    );

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Biblioteca de Ejercicios"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-glass-border bg-background p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 pr-10 text-left">
                    <h2 className="text-2xl font-semibold text-foreground">
                        Biblioteca de Ejercicios
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    aria-label="Cerrar modal"
                >
                    <X className="h-4 w-4" />
                </button>

                {isLoading ? (
                    <div className="flex min-h-[320px] items-center justify-center text-muted-foreground">
                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                        Cargando ejercicios...
                    </div>
                ) : error ? (
                    <div className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
                        <p>{error}</p>
                        <Button variant="outline" onClick={onClose}>
                            <X className="mr-2 h-4 w-4" />
                            Cerrar
                        </Button>
                    </div>
                ) : selectedExercise ? (
                    <div className="space-y-5 overflow-y-auto pr-1">
                        <div className="space-y-2">
                            <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                Exercise detail
                            </p>
                            <h3 className="text-2xl font-semibold text-foreground">
                                {selectedExercise.name}
                            </h3>
                        </div>

                        {selectedDescription ? (
                            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                {selectedDescription}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No description available.
                            </p>
                        )}

                        {Array.isArray(selectedExercise.images) && selectedExercise.images.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {selectedExercise.images.map((imgObj, index) => {
                                    if (!imgObj || !imgObj.url) return null;

                                    return (
                                        <figure
                                            key={imgObj.id || `img-${index}`}
                                            className="overflow-hidden rounded-2xl border border-glass-border bg-white"
                                        >
                                            <img
                                                src={imgObj.url}
                                                alt={`${selectedExercise.name}`}
                                                className="h-64 w-full object-contain p-2"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://placehold.co/400x400/eeeeee/999999?text=Sin+Imagen';
                                                }}
                                            />
                                        </figure>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-glass-border bg-background/40 p-5 text-center text-sm text-muted-foreground">
                                No hay imágenes disponibles para este ejercicio.
                            </div>
                        )}

                        {Array.isArray(selectedExercise.videos) && selectedExercise.videos.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-foreground">Videos</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {selectedExercise.videos.map((video, index) => (
                                        <a
                                            key={video.id || `vid-${index}`}
                                            href={video.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border border-glass-border bg-background/40 px-4 py-3 text-sm text-neon-blue transition hover:border-neon-blue/60 hover:bg-background/60"
                                        >
                                            Ver video {index + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedExercise(null)}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a la lista
                            </Button>
                            <Button type="button" onClick={onClose}>
                                <X className="mr-2 h-4 w-4" />
                                Cerrar modal
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 overflow-y-auto pr-1">
                        <p className="text-sm text-muted-foreground">
                            Selecciona un ejercicio para ver su detalle.
                        </p>
                        {exercises.length ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {exercises.map((exercise) => (
                                    <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => setSelectedExercise(exercise)}
                                        className="rounded-2xl border border-glass-border bg-background/40 px-4 py-4 text-left transition hover:border-neon-blue/60 hover:bg-background/60 hover:text-neon-blue"
                                    >
                                        <p className="line-clamp-2 text-sm font-semibold text-foreground">
                                            {exercise.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-glass-border bg-background/40 p-5 text-sm text-muted-foreground">
                                No se encontraron ejercicios en la API por el momento.
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="button" variant="outline" onClick={onClose}>
                                <X className="mr-2 h-4 w-4" />
                                Cerrar modal
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
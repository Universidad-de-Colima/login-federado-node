import { useCallback, useRef } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "@heroui/react";

import { cn } from "@/lib/utils";

export type TransitionVariant =
	| "circle"
	| "square"
	| "triangle"
	| "diamond"
	| "hexagon"
	| "rectangle"
	| "star";

type Theme = "light" | "system" | "dark";

interface AnimatedThemeTogglerProps {
	className?: string;
	duration?: number;
	variant?: TransitionVariant;
	fromCenter?: boolean;
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
	const pairs = Array.from(
		{ length: vertexCount },
		() => `${cx}px ${cy}px`,
	).join(", ");
	return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
	variant: TransitionVariant,
	cx: number,
	cy: number,
	maxRadius: number,
	viewportWidth: number,
	viewportHeight: number,
): [string, string] {
	switch (variant) {
		case "circle":
			return [
				`circle(0px at ${cx}px ${cy}px)`,
				`circle(${maxRadius}px at ${cx}px ${cy}px)`,
			];
		case "square": {
			const halfSide =
				Math.max(
					Math.max(cx, viewportWidth - cx),
					Math.max(cy, viewportHeight - cy),
				) * 1.05;
			const end = [
				`${cx - halfSide}px ${cy - halfSide}px`,
				`${cx + halfSide}px ${cy - halfSide}px`,
				`${cx + halfSide}px ${cy + halfSide}px`,
				`${cx - halfSide}px ${cy + halfSide}px`,
			].join(", ");
			return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
		}
		case "triangle": {
			const scale = maxRadius * 2.2;
			const dx = (Math.sqrt(3) / 2) * scale;
			const verts = [
				`${cx}px ${cy - scale}px`,
				`${cx + dx}px ${cy + 0.5 * scale}px`,
				`${cx - dx}px ${cy + 0.5 * scale}px`,
			].join(", ");
			return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
		}
		case "diamond": {
			const R = maxRadius * Math.SQRT2;
			const end = [
				`${cx}px ${cy - R}px`,
				`${cx + R}px ${cy}px`,
				`${cx}px ${cy + R}px`,
				`${cx - R}px ${cy}px`,
			].join(", ");
			return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
		}
		case "hexagon": {
			const R = maxRadius * Math.SQRT2;
			const verts: string[] = [];
			for (let i = 0; i < 6; i++) {
				const a = -Math.PI / 2 + (i * Math.PI) / 3;
				verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
			}
			return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`];
		}
		case "rectangle": {
			const halfW = Math.max(cx, viewportWidth - cx);
			const halfH = Math.max(cy, viewportHeight - cy);
			const end = [
				`${cx - halfW}px ${cy - halfH}px`,
				`${cx + halfW}px ${cy - halfH}px`,
				`${cx + halfW}px ${cy + halfH}px`,
				`${cx - halfW}px ${cy + halfH}px`,
			].join(", ");
			return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
		}
		case "star": {
			const R = maxRadius * Math.SQRT2 * 1.03;
			const innerRatio = 0.42;
			const starPolygon = (radius: number) => {
				const verts: string[] = [];
				for (let i = 0; i < 5; i++) {
					const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
					verts.push(
						`${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`,
					);
					const innerA = outerA + Math.PI / 5;
					verts.push(
						`${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`,
					);
				}
				return `polygon(${verts.join(", ")})`;
			};
			return [starPolygon(Math.max(2, R * 0.025)), starPolygon(R)];
		}
		default:
			return [
				`circle(0px at ${cx}px ${cy}px)`,
				`circle(${maxRadius}px at ${cx}px ${cy}px)`,
			];
	}
}

const INDICATOR_TRANSLATE: Record<Theme, string> = {
	light: "translate-x-0",
	system: "translate-x-8",
	dark: "translate-x-16",
};

export const AnimatedThemeToggler = ({
	duration = 400,
	variant,
	fromCenter = false,
}: AnimatedThemeTogglerProps) => {
	const shape = variant ?? "circle";
	const { theme, setTheme } = useTheme("light");
	const containerRef = useRef<HTMLDivElement>(null);

	const handleThemeChange = useCallback(
		(key: Theme) => {
			if (key === (theme as Theme)) return;

			const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
			const viewportHeight =
				window.visualViewport?.height ?? window.innerHeight;

			let x: number;
			let y: number;
			if (fromCenter) {
				x = viewportWidth / 2;
				y = viewportHeight / 2;
			} else {
				const el = containerRef.current;
				if (el) {
					const { top, left, width, height } = el.getBoundingClientRect();
					x = left + width / 2;
					y = top + height / 2;
				} else {
					x = viewportWidth / 2;
					y = viewportHeight / 2;
				}
			}

			const maxRadius = Math.hypot(
				Math.max(x, viewportWidth - x),
				Math.max(y, viewportHeight - y),
			);

			const applyTheme = () => {
				setTheme(key);
			};

			if (typeof document.startViewTransition !== "function") {
				applyTheme();
				return;
			}

			const root = document.documentElement;
			root.dataset.magicuiThemeVt = "active";
			root.style.setProperty(
				"--magicui-theme-toggle-vt-duration",
				`${duration}ms`,
			);
			const cleanup = () => {
				delete root.dataset.magicuiThemeVt;
				root.style.removeProperty("--magicui-theme-toggle-vt-duration");
			};

			const transition = document.startViewTransition(() => {
				flushSync(applyTheme);
			});
			if (typeof transition?.finished?.finally === "function") {
				transition.finished.finally(cleanup);
			} else {
				cleanup();
			}

			const ready = transition?.ready;
			if (ready && typeof ready.then === "function") {
				const clipPath = getThemeTransitionClipPaths(
					shape,
					x,
					y,
					maxRadius,
					viewportWidth,
					viewportHeight,
				);
				ready.then(() => {
					document.documentElement.animate(
						{ clipPath },
						{
							duration,
							easing: shape === "star" ? "linear" : "ease-in-out",
							fill: "forwards",
							pseudoElement: "::view-transition-new(root)",
						},
					);
				});
			}
		},
		[shape, fromCenter, duration, theme],
	);

	const pressedLight = theme === "light";
	const pressedSystem = theme === "system";
	const pressedDark = theme === "dark";

	return (
		<div
			ref={containerRef}
			role="group"
			aria-label="Theme"
			className={cn(
				"relative inline-flex items-center rounded-full bg-background/20 px-1",
			)}
		>
			{/* Sliding indicator */}
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute left-1 size-8 rounded-full bg-background shadow-sm",
					"transition-transform duration-200 ease-out",
					INDICATOR_TRANSLATE[theme as Theme],
				)}
			/>

			<button
				type="button"
				aria-pressed={pressedLight}
				aria-label="Light theme"
				onClick={() => handleThemeChange("light")}
				className={cn(
					"relative z-10 inline-flex size-8 items-center justify-center rounded-full",
					"transition-colors duration-200",
					theme === "light" ? "text-foreground" : "text-muted-foreground",
				)}
			>
				<Sun className="size-4" />
			</button>

			<button
				type="button"
				aria-pressed={pressedSystem}
				aria-label="System theme"
				onClick={() => handleThemeChange("system")}
				className={cn(
					"relative z-10 inline-flex size-8 items-center justify-center rounded-full",
					"transition-colors duration-200",
					theme === "system" ? "text-foreground" : "text-muted-foreground",
				)}
			>
				<Monitor className="size-4" />
			</button>

			<button
				type="button"
				aria-pressed={pressedDark}
				aria-label="Dark theme"
				onClick={() => handleThemeChange("dark")}
				className={cn(
					"relative z-10 inline-flex size-8 items-center justify-center rounded-full",
					"transition-colors duration-200",
					theme === "dark" ? "text-foreground" : "text-muted-foreground",
				)}
			>
				<Moon className="size-4" />
			</button>
		</div>
	);
};

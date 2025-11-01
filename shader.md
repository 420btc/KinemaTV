You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
animated-cards-stack.tsx
"use client" 

import * as React from "react"

import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

const cardVariants = cva("absolute will-change-transform", {
  variants: {
    variant: {
      dark: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-stone-700/50 bg-accent-foreground/80 p-6 backdrop-blur-md",
      light:
        "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border  bg-accent bg-background/80 p-6 backdrop-blur-md ",
    },
  },
  defaultVariants: {
    variant: "light",
  },
})
interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  maxRating?: number
}
interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}
interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)
function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (context === undefined) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScrollContextProvider"
    )
  }
  return context
}

export const ContainerScroll: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, style, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-svh w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}
ContainerScroll.displayName = "ContainerScroll"

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
}
CardsContainer.displayName = "CardsContainer"
export const CardTransformed = React.forwardRef<
  HTMLDivElement,
  CardStickyProps
>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation = -index + 90,
      className,
      variant,
      style,
      ...props
    },
    ref
  ) => {

    
    const { scrollYProgress } = useContainerScrollContext()

    const start = index / (arrayLength + 1)
    const end = (index + 1) / (arrayLength + 1)
    const range = React.useMemo(() => [start, end], [start, end])
    const rotateRange = [range[0] - 1.5, range[1] / 1.5]

    const y = useTransform(scrollYProgress, range, ["0%", "-180%"])
    const rotate = useTransform(scrollYProgress, rotateRange, [
      incrementRotation,
      0,
    ])
    const transform = useMotionTemplate`translateZ(${
      index * incrementZ
    }px) translateY(${y}) rotate(${rotate}deg)`

    const dx = useTransform(scrollYProgress, rotateRange, [4, 0])
    const dy = useTransform(scrollYProgress, rotateRange, [4, 12])
    const blur = useTransform(scrollYProgress, rotateRange, [2, 24])
    const alpha = useTransform(scrollYProgress, rotateRange, [0.15, 0.2])
    const filter =
      variant === "light" 
        ? useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`
        : "none"

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: "hidden" as const,
      zIndex: (arrayLength - index) * incrementZ,
      filter,
      ...style,
    }
    return (
      <motion.div
        layout="position"
        ref={ref}
        style={cardStyle}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
CardTransformed.displayName = "CardTransformed"

export const ReviewStars = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ rating, maxRating = 5, className, ...props }, ref) => {
    const filledStars = Math.floor(rating)
    const fractionalPart = rating - filledStars
    const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0)

    return (
      <div
        className={cn("flex items-center gap-2", className)}
        ref={ref}
        {...props}
      >
        <div className="flex items-center">
          {[...Array(filledStars)].map((_, index) => (
            <svg
              key={`filled-${index}`}
              className="size-4 text-inherit"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
          {fractionalPart > 0 && (
            <svg
              className="size-4 text-inherit"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id="half">
                  <stop
                    offset={`${fractionalPart * 100}%`}
                    stopColor="currentColor"
                  />
                  <stop
                    offset={`${fractionalPart * 100}%`}
                    stopColor="rgb(209 213 219)"
                  />
                </linearGradient>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                fill="url(#half)"
              />
            </svg>
          )}
          {[...Array(emptyStars)].map((_, index) => (
            <svg
              key={`empty-${index}`}
              className="size-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
        </div>
        <p className="sr-only">{rating}</p>
      </div>
    )
  }
)
ReviewStars.displayName = "ReviewStars"


demo.tsx
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/blocks/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TESTIMONIALS = [
  {
    id: "testimonial-3",
    name: "James S.",
    profession: "Frontend Developer",
    rating: 5,
    description:
      "Their innovative solutions and quick turnaround time made our collaboration incredibly successful. Highly recommended!",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "testimonial-1",
    name: "Jessica H.",
    profession: "Web Designer",
    rating: 4.5,
    description:
      "The attention to detail and user experience in their work is exceptional. I'm thoroughly impressed with the final product.",
    avatarUrl:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "testimonial-2",
    name: "Lisa M.",
    profession: "UX Designer",
    rating: 5,
    description:
      "Working with them was a game-changer for our project. Their expertise and professionalism exceeded our expectations.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "testimonial-4",
    name: "Jane D.",
    profession: "UI/UX Designer",
    rating: 4.5,
    description:
      "The quality of work and communication throughout the project was outstanding. They delivered exactly what we needed.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
  },
]

const ANIM_IMAGES = [
  "https://img.freepik.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666687.jpg?semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/anime-character-winter_23-2151843507.jpg?semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/anime-character-using-virtual-reality-glasses-metaverse_23-2151568847.jpg?semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/anime-character-using-virtual-reality-glasses-metaverse_23-2151568850.jpg?t=st=1747007259~exp=1747010859~hmac=0f9056951d9ea1c8bf86dd63e33b00ea3a34e3a40575b5ec5b7bd77cfca69ad6&w=996",
  "https://img.freepik.com/free-photo/fantasy-anime-style-scene_23-2151135073.jpg?t=st=1747006767~exp=1747010367~hmac=f744af6af2545a9dcb4f01d78af38e2828b0375243bc3c1dfae391b2db68c09f&w=900",
]

function getSectionClass(theme: string | undefined) {
  return theme === "dark"
    ? "bg-destructive text-secondary px-8 py-12"
    : "bg-accent px-8 py-12"
}

function getReviewStarsClass(theme: string | undefined) {
  return theme === "dark" ? "text-primary" : "text-teal-500"
}

function getTextClass(theme: string | undefined) {
  return theme === "dark" ? "text-primary-foreground" : ""
}

function getAvatarClass(theme: string | undefined) {
  return theme === "dark"
    ? "!size-12 border border-stone-700"
    : "!size-12 border border-stone-300"
}

function getCardVariant(theme: string | undefined) {
  return theme === "dark" ? "dark" : "light"
}

export function TestimonialsVariant() {
  const { theme } = useTheme()

  return (
    <section className={getSectionClass(theme)}>
      <div>
        <h3 className="text-center text-4xl font-semibold">Testimonials</h3>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
          consequatur reprehenderit.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh] ">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[450px] w-[350px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                arrayLength={TESTIMONIALS.length}
                key={testimonial.id}
                variant={getCardVariant(theme)}
                index={index + 2}
                role="article"
                aria-labelledby={`card-${testimonial.id}-title`}
                aria-describedby={`card-${testimonial.id}-content`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars
                    className={getReviewStarsClass(theme)}
                    rating={testimonial.rating}
                  />
                  <div className={`mx-auto w-4/5 text-lg ${getTextClass(theme)}`}>
                    <blockquote cite="#">{testimonial.description}</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className={getAvatarClass(theme)}>
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Portrait of ${testimonial.name}`}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="block text-lg font-semibold tracking-tight md:text-xl">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-muted-foreground ">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}

export const AwardsVariant = () => {
  return (
    <section className="bg-accent px-8 py-12">
      <div>
        <h2 className="text-center text-4xl font-semibold">Recognitions</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
          consequatur reprehenderit.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh] ">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-72 w-[440px]">
            <CardTransformed
              className="items-start justify-evenly border-none bg-blue-600/80  text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={1}
            >
              <div className="flex flex-col items-start justify-start space-y-4 ">
                <div className="flex size-16 items-center justify-center  rounded-sm bg-secondary/50 text-2xl">
                  🏆
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">Awwwards</h4>
                  <h3 className="text-2xl font-bold">Site of the Day</h3>
                </div>
              </div>
              <p className=" text-secondary/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus consequatur reprehenderit.
              </p>
            </CardTransformed>

            <CardTransformed
              className="items-start justify-evenly border-none bg-orange-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={2}
            >
              <div className="flex flex-col items-start justify-start space-y-4 ">
                <div className="flex size-16 items-center justify-center  rounded-sm bg-secondary/50 text-2xl">
                  🚀
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">
                    Performance
                  </h4>
                  <h3 className="text-2xl font-bold">100% Performance Score</h3>
                </div>
              </div>
              <p className=" text-secondary/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus consequatur reprehenderit.
              </p>
            </CardTransformed>
            <CardTransformed
              className="items-start justify-evenly border-none bg-cyan-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={3}
            >
              <div className="flex flex-col items-start justify-start space-y-4 ">
                <div className="flex size-16 items-center justify-center  rounded-sm bg-secondary/50 text-2xl">
                  🎯
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">
                    CSS awaaards
                  </h4>
                  <h3 className="text-2xl font-bold">Honorable Mention</h3>
                </div>
              </div>
              <p className=" text-secondary/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus consequatur reprehenderit.
              </p>
            </CardTransformed>
            <CardTransformed
              className="items-start justify-evenly border-none bg-violet-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={4}
            >
              <div className="flex flex-col items-start justify-start space-y-4 ">
                <div className="flex size-16 items-center justify-center  rounded-sm bg-secondary/50 text-2xl">
                  🎖
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">awaaards</h4>
                  <h4 className="text-2xl font-bold">Most Creative Design</h4>
                </div>
              </div>
              <p className=" text-secondary/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus consequatur reprehenderit.
              </p>
            </CardTransformed>
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}

export const ImagesVariant = () => {
  return (
    <section className=" bg-slate-900 px-8 py-12">
      <div>
        <h2 className="text-center text-4xl font-semibold">
          Try our AI Fantázomai
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
          consequatur reprehenderit.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh] ">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[420px] w-[320px]">
            {ANIM_IMAGES.map((imageUrl, index) => (
              <CardTransformed
                arrayLength={ANIM_IMAGES.length}
                key={index}
                index={index + 2}
                variant={"dark"}
                className="overflow-hidden !rounded-sm !p-0"
              >
                <img
                  src={imageUrl}
                  alt="anime"
                  className="size-full object-cover"
                  width={"100%"}
                  height={"100%"}
                />
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}

```

Copy-paste these files for dependencies:
```tsx
shadcn/avatar
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

```

Install NPM dependencies:
```bash
motion, class-variance-authority, @radix-ui/react-avatar
```

Extend existing globals.css with this code:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 48 33.33% 97.06%;
    --foreground: 48 19.61% 20%;
    --card: 48 33.33% 97.06%;
    --card-foreground: 60 2.56% 7.65%;
    --popover: 0 0% 100%;
    --popover-foreground: 50.77 19.40% 13.14%;
    --primary: 15.11 55.56% 52.35%;
    --primary-foreground: 0 0% 100%;
    --secondary: 46.15 22.81% 88.82%;
    --secondary-foreground: 50.77 8.50% 30.00%;
    --muted: 44.00 29.41% 90%;
    --muted-foreground: 50.00 2.36% 50.20%;
    --accent: 46.15 22.81% 88.82%;
    --accent-foreground: 50.77 19.40% 13.14%;
    --destructive: 60 2.56% 7.65%;
    --destructive-foreground: 0 0% 100%;
    --border: 50 7.50% 84.31%;
    --input: 50.77 7.98% 68.04%;
    --ring: 210 74.80% 49.80%;
    --chart-1: 18.28 57.14% 43.92%;
    --chart-2: 251.45 84.62% 74.51%;
    --chart-3: 46.15 28.26% 81.96%;
    --chart-4: 256.55 49.15% 88.43%;
    --chart-5: 17.78 60% 44.12%;
    --sidebar: 51.43 25.93% 94.71%;
    --sidebar-foreground: 60 2.52% 23.33%;
    --sidebar-primary: 15.11 55.56% 52.35%;
    --sidebar-primary-foreground: 0 0% 98.43%;
    --sidebar-accent: 46.15 22.81% 88.82%;
    --sidebar-accent-foreground: 0 0% 20.39%;
    --sidebar-border: 0 0% 92.16%;
    --sidebar-ring: 0 0% 70.98%;
    --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --radius: 0.5rem;
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  }

  .dark {
    --background: 60 2.70% 14.51%;
    --foreground: 46.15 9.77% 73.92%;
    --card: 60 2.70% 14.51%;
    --card-foreground: 48 33.33% 97.06%;
    --popover: 60 2.13% 18.43%;
    --popover-foreground: 60 5.45% 89.22%;
    --primary: 14.77 63.11% 59.61%;
    --primary-foreground: 0 0% 100%;
    --secondary: 48 33.33% 97.06%;
    --secondary-foreground: 60 2.13% 18.43%;
    --muted: 60 3.85% 10.20%;
    --muted-foreground: 51.43 8.86% 69.02%;
    --accent: 48 10.64% 9.22%;
    --accent-foreground: 51.43 25.93% 94.71%;
    --destructive: 0 84.24% 60.20%;
    --destructive-foreground: 0 0% 100%;
    --border: 60 5.08% 23.14%;
    --input: 52.50 5.13% 30.59%;
    --ring: 210 74.80% 49.80%;
    --chart-1: 18.28 57.14% 43.92%;
    --chart-2: 251.45 84.62% 74.51%;
    --chart-3: 48 10.64% 9.22%;
    --chart-4: 248.28 25.22% 22.55%;
    --chart-5: 17.78 60% 44.12%;
    --sidebar: 30 3.33% 11.76%;
    --sidebar-foreground: 46.15 9.77% 73.92%;
    --sidebar-primary: 0 0% 20.39%;
    --sidebar-primary-foreground: 0 0% 98.43%;
    --sidebar-accent: 60 3.45% 5.69%;
    --sidebar-accent-foreground: 46.15 9.77% 73.92%;
    --sidebar-border: 0 0% 92.16%;
    --sidebar-ring: 0 0% 70.98%;
    --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --radius: 0.5rem;
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  }
}

@layer base {
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them

"use client";

import {
    Check,
    Minus,
    Plus,
    ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useCartStore } from "@/app/stores/cart-store";
import { announceCartItemAdded } from "@/lib/cart-events";

type MobileProductPurchaseBarProps = {
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        image: string | null;
        stock: number;
    };
};

export function MobileProductPurchaseBar({
    product,
}: MobileProductPurchaseBarProps) {
    const addItem = useCartStore(
        (state) => state.addItem,
    );

    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] =
        useState(false);

    const isOutOfStock = product.stock <= 0;

    useEffect(() => {
        if (quantity > product.stock) {
            setQuantity(Math.max(1, product.stock));
        }
    }, [product.stock, quantity]);

    function decreaseQuantity() {
        setQuantity((currentQuantity) =>
            Math.max(1, currentQuantity - 1),
        );
    }

    function increaseQuantity() {
        setQuantity((currentQuantity) =>
            Math.min(
                product.stock,
                currentQuantity + 1,
            ),
        );
    }

    function handleAddToCart() {
        if (isOutOfStock || justAdded) {
            return;
        }

        for (
            let index = 0;
            index < quantity;
            index += 1
        ) {
            addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image,
                stock: product.stock,
            });
        }

        announceCartItemAdded({
            productName: product.name,
            quantity,
        });

        setJustAdded(true);

        window.setTimeout(() => {
            setJustAdded(false);
        }, 1300);
    }

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-[9999] border-t border-white/10 bg-[#111111]/95 px-3 pt-3 text-white shadow-[0_-16px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
            style={{
                paddingBottom:
                    "max(0.75rem, env(safe-area-inset-bottom))",
            }}
        >
            <div className="mx-auto flex max-w-md items-center gap-2">
                <div className="flex h-12 shrink-0 items-center rounded-xl border border-white/10 bg-white/10">
                    <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={
                            isOutOfStock || quantity <= 1
                        }
                        aria-label="Scade cantitatea"
                        className="flex size-11 items-center justify-center rounded-xl text-white transition active:scale-90 active:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <Minus className="size-4" />
                    </button>

                    <span
                        aria-live="polite"
                        className="min-w-7 text-center font-condensed text-base font-bold text-white"
                    >
                        {isOutOfStock ? 0 : quantity}
                    </span>

                    <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={
                            isOutOfStock ||
                            quantity >= product.stock
                        }
                        aria-label="Crește cantitatea"
                        className="flex size-11 items-center justify-center rounded-xl text-white transition active:scale-90 active:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <Plus className="size-4" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || justAdded}
                    className={[
                        "font-condensed flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed",
                        isOutOfStock
                            ? "bg-neutral-600 opacity-70"
                            : justAdded
                                ? "bg-green-600 shadow-[0_8px_25px_rgba(22,163,74,0.35)]"
                                : "bg-primary shadow-[0_8px_25px_rgba(234,88,12,0.35)]",
                    ].join(" ")}
                >
                    {justAdded ? (
                        <>
                            <Check className="animate-cart-check size-5" />
                            Adăugat
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="size-5" />

                            {isOutOfStock
                                ? "Stoc epuizat"
                                : "Adaugă în coș"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
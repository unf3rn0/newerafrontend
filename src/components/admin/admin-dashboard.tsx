import {
  CheckCircle2,
  CircleSlash,
  PackageCheck,
  PackagePlus,
  Pencil,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { CustomSelect, type CustomSelectOption } from "@/components/ui/custom-select";
import { Input, Textarea } from "@/components/ui/input";
import {
  createCategoryAction,
  createProductAction,
  createPromoCodeAction,
  deleteCategoryAction,
  deleteProductAction,
  deletePromoCodeAction,
  setOrderPaymentAction,
  setOrderStatusAction,
  updateCategoryAction,
  updateOrderStatusAction,
  updateProductAction,
  updatePromoCodeAction,
} from "@/lib/admin/actions";
import type { getAdminDashboardData } from "@/lib/admin/db";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";

type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboardData>>;
type AdminCategory = AdminDashboardData["categories"][number];
type AdminProduct = AdminDashboardData["products"][number];
type AdminOrder = AdminDashboardData["orders"][number];
type AdminPromoCode = AdminDashboardData["promoCodes"][number];

type AdminDashboardProps = {
  data: AdminDashboardData;
  locale: Locale;
  status?: string;
};

const copy = {
  en: {
    actions: "Actions",
    admin: "Admin",
    active: "Active",
    activeStatus: "Active",
    archived: "Archived",
    brand: "Brand",
    cancelled: "Cancelled",
    categories: "Categories",
    category: "Category",
    colors: "Colors",
    completed: "Completed",
    composition: "Composition",
    confirmPayment: "Confirm payment",
    create: "Create",
    createCategory: "Create category",
    createProduct: "Create product",
    createPromoCode: "Create promo code",
    customer: "Customer",
    delete: "Delete",
    description: "Description",
    discountType: "Discount type",
    discountValue: "Discount value",
    draft: "Draft",
    delivery: "Delivery",
    expiresAt: "Expires",
    featured: "Featured",
    fixedDiscount: "Fixed amount",
    gallery: "Gallery URLs",
    gender: "Gender",
    image: "Image URL",
    inStock: "In stock",
    inventory: "Inventory",
    maxDiscount: "Max discount",
    minimumOrder: "Minimum order",
    men: "Men",
    name: "Name",
    new: "New",
    noOrders: "No orders yet.",
    noProducts: "No products yet.",
    noPromoCodes: "No promo codes yet.",
    oldPrice: "Old price",
    orders: "Orders",
    payment: "Payment",
    percentDiscount: "Percent",
    popular: "Popular",
    price: "Price",
    processing: "Processing",
    productFlags: "Product flags",
    products: "Products",
    promoCode: "Promo code",
    promoCodes: "Promo codes",
    rejectPayment: "Reject payment",
    save: "Save",
    shipped: "Shipped",
    sku: "SKU",
    sizes: "Sizes",
    sale: "Sale",
    startsAt: "Starts",
    slug: "Slug",
    sortOrder: "Sort order",
    status: "Status",
    stock: "Stock",
    subtitle: "Catalog, products, customers, and QR-payment orders.",
    title: "NewEra admin dashboard",
    total: "Total",
    usageLimit: "Usage limit",
    used: "Used",
    users: "Users",
    unpaid: "Unpaid",
    unisex: "Unisex",
    userMarkedPaid: "User marked paid",
    waitingConfirmation: "Waiting confirmation",
    women: "Women",
  },
  ru: {
    actions: "Действия",
    admin: "Админ",
    active: "Активен",
    activeStatus: "Активный",
    archived: "Архив",
    brand: "Бренд",
    cancelled: "Отменён",
    categories: "Категории",
    category: "Категория",
    colors: "Цвета",
    completed: "Завершён",
    composition: "Состав",
    confirmPayment: "Подтвердить оплату",
    create: "Создать",
    createCategory: "Создать категорию",
    createProduct: "Создать товар",
    createPromoCode: "Создать промокод",
    customer: "Покупатель",
    delete: "Удалить",
    description: "Описание",
    discountType: "Тип скидки",
    discountValue: "Размер скидки",
    draft: "Черновик",
    delivery: "Доставка",
    expiresAt: "Действует до",
    featured: "На главной",
    fixedDiscount: "Фиксированная",
    gallery: "URL галереи",
    gender: "Пол",
    image: "URL изображения",
    inStock: "В наличии",
    inventory: "Склад",
    maxDiscount: "Макс. скидка",
    minimumOrder: "Мин. заказ",
    men: "Мужское",
    name: "Название",
    new: "Новинка",
    noOrders: "Заказов пока нет.",
    noProducts: "Товаров пока нет.",
    noPromoCodes: "Промокодов пока нет.",
    oldPrice: "Старая цена",
    orders: "Заказы",
    payment: "Оплата",
    percentDiscount: "Процент",
    popular: "Популярное",
    price: "Цена",
    processing: "В обработку",
    productFlags: "Флаги товара",
    products: "Товары",
    promoCode: "Промокод",
    promoCodes: "Промокоды",
    rejectPayment: "Отклонить оплату",
    save: "Сохранить",
    shipped: "Отправлен",
    sku: "SKU",
    sizes: "Размеры",
    sale: "Скидка",
    startsAt: "Действует с",
    slug: "Slug",
    sortOrder: "Порядок",
    status: "Статус",
    stock: "Остаток",
    subtitle: "Каталог, товары, клиенты и QR-заказы.",
    title: "Админ-панель NewEra",
    total: "Сумма",
    usageLimit: "Лимит использований",
    used: "Использовано",
    users: "Пользователи",
    unpaid: "Не оплачено",
    unisex: "Унисекс",
    userMarkedPaid: "Пользователь отметил оплату",
    waitingConfirmation: "Ожидает подтверждения",
    women: "Женское",
  },
  tg: {
    actions: "Амалҳо",
    admin: "Админ",
    active: "Фаъол",
    activeStatus: "Фаъол",
    archived: "Архив",
    brand: "Бренд",
    cancelled: "Бекор шуд",
    categories: "Категорияҳо",
    category: "Категория",
    colors: "Рангҳо",
    completed: "Анҷом",
    composition: "Таркиб",
    confirmPayment: "Тасдиқи пардохт",
    create: "Сохтан",
    createCategory: "Сохтани категория",
    createProduct: "Сохтани мол",
    createPromoCode: "Сохтани промокод",
    customer: "Харидор",
    delete: "Нест кардан",
    description: "Тавсиф",
    discountType: "Навъи тахфиф",
    discountValue: "Ҳаҷми тахфиф",
    draft: "Черновик",
    delivery: "Доставка",
    expiresAt: "То сана",
    featured: "Дар асосӣ",
    fixedDiscount: "Маблағи собит",
    gallery: "URL галерея",
    gender: "Ҷинс",
    image: "URL акс",
    inStock: "Дар анбор",
    inventory: "Анбор",
    maxDiscount: "Тахфифи максимум",
    minimumOrder: "Фармоиши минимум",
    men: "Мардона",
    name: "Ном",
    new: "Нав",
    noOrders: "Ҳоло фармоиш нест.",
    noProducts: "Ҳоло мол нест.",
    noPromoCodes: "Ҳоло промокод нест.",
    oldPrice: "Нархи кӯҳна",
    orders: "Фармоишҳо",
    payment: "Пардохт",
    percentDiscount: "Фоиз",
    popular: "Маъмул",
    price: "Нарх",
    processing: "Ба коркард",
    productFlags: "Нишонаҳои мол",
    products: "Молҳо",
    promoCode: "Промокод",
    promoCodes: "Промокодҳо",
    rejectPayment: "Рад кардани пардохт",
    save: "Нигоҳ доштан",
    shipped: "Фиристода шуд",
    sku: "SKU",
    sizes: "Андозаҳо",
    sale: "Тахфиф",
    startsAt: "Аз сана",
    slug: "Slug",
    sortOrder: "Тартиб",
    status: "Статус",
    stock: "Бақия",
    subtitle: "Каталог, молҳо, клиентҳо ва QR-фармоишҳо.",
    title: "Админ-панели NewEra",
    total: "Ҳамагӣ",
    usageLimit: "Лимити истифода",
    used: "Истифода шуд",
    users: "Истифодабарандагон",
    unpaid: "Пардохт нашудааст",
    unisex: "Унисекс",
    userMarkedPaid: "Истифодабаранда пардохтро қайд кард",
    waitingConfirmation: "Интизори тасдиқ",
    women: "Занона",
  },
} satisfies Record<Locale, Record<string, string>>;

function genderOptions(locale: Locale): CustomSelectOption[] {
  const text = copy[locale];

  return [
    { label: text.unisex, value: "UNISEX" },
    { label: text.women, value: "WOMEN" },
    { label: text.men, value: "MEN" },
  ];
}

function productStatusOptions(locale: Locale): CustomSelectOption[] {
  const text = copy[locale];

  return [
    { label: text.activeStatus, value: "ACTIVE" },
    { label: text.draft, value: "DRAFT" },
    { label: text.archived, value: "ARCHIVED" },
  ];
}

function paymentStatusOptions(locale: Locale): CustomSelectOption[] {
  const text = copy[locale];

  return [
    { label: text.unpaid, value: "UNPAID" },
    { label: text.userMarkedPaid, value: "USER_MARKED_PAID" },
    { label: text.waitingConfirmation, value: "WAITING_CONFIRMATION" },
    { label: text.confirmPayment, value: "CONFIRMED" },
    { label: text.rejectPayment, value: "REJECTED" },
  ];
}

function orderStatusOptions(locale: Locale): CustomSelectOption[] {
  const text = copy[locale];

  return [
    { label: text.new, value: "NEW" },
    { label: text.processing, value: "PROCESSING" },
    { label: text.shipped, value: "SHIPPED" },
    { label: text.completed, value: "COMPLETED" },
    { label: text.cancelled, value: "CANCELLED" },
  ];
}

function discountTypeOptions(locale: Locale): CustomSelectOption[] {
  const text = copy[locale];

  return [
    { label: text.percentDiscount, value: "PERCENT" },
    { label: text.fixedDiscount, value: "FIXED" },
  ];
}

function toInput(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function toDateInput(value: Date | null) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function StatusBanner({ locale, status }: { locale: Locale; status?: string }) {
  if (!status) {
    return null;
  }

  const text = copy[locale];
  const isError = status.endsWith("error");

  return (
    <div
      className={
        isError
          ? "rounded-lg border border-warning/25 bg-[#fff7ed] px-4 py-3 text-sm font-medium text-warning"
          : "rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-accent-foreground"
      }
    >
      {isError ? "Проверьте данные формы." : `${text.status}: ${status}`}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function CategoryForm({ category, locale }: { category?: AdminCategory; locale: Locale }) {
  const text = copy[locale];
  const action = category
    ? updateCategoryAction.bind(null, locale, category.id)
    : createCategoryAction.bind(null, locale);

  return (
    <form action={action} className="rounded-lg border border-border bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.name}</span>
          <Input defaultValue={category?.name} name="name" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.slug}</span>
          <Input defaultValue={category?.slug} name="slug" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.sortOrder}</span>
          <Input defaultValue={category?.sortOrder ?? 50} min={0} name="sortOrder" type="number" />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.image}</span>
          <Input defaultValue={category?.imageUrl ?? ""} name="imageUrl" />
        </label>
        <label className="block space-y-2 text-sm font-medium md:col-span-2">
          <span>{text.description}</span>
          <Textarea defaultValue={category?.description ?? ""} name="description" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <CheckboxField
          defaultChecked={category?.isActive ?? true}
          label={text.active}
          name="isActive"
        />
        <Button type="submit" variant={category ? "outline" : "primary"}>
          {category ? (
            <Save aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Plus aria-hidden="true" className="h-4 w-4" />
          )}
          {category ? text.save : text.create}
        </Button>
      </div>
    </form>
  );
}

function ProductForm({
  categories,
  locale,
  product,
}: {
  categories: AdminCategory[];
  locale: Locale;
  product?: AdminProduct;
}) {
  const text = copy[locale];
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const action = product
    ? updateProductAction.bind(null, locale, product.id)
    : createProductAction.bind(null, locale);

  return (
    <form action={action} className="rounded-lg border border-border bg-white p-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.name}</span>
          <Input defaultValue={product?.name} name="name" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.slug}</span>
          <Input defaultValue={product?.slug} name="slug" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.sku}</span>
          <Input defaultValue={product?.sku} name="sku" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.price}</span>
          <Input
            defaultValue={toInput(product?.price)}
            min="0"
            name="price"
            required
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.oldPrice}</span>
          <Input defaultValue={toInput(product?.oldPrice)} min="0" name="oldPrice" type="number" />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.stock}</span>
          <Input
            defaultValue={product?.stockQuantity ?? 1}
            min="0"
            name="stockQuantity"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium lg:col-span-2">
          <span>{text.image}</span>
          <Input defaultValue={product?.imageUrl} name="imageUrl" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.brand}</span>
          <Input defaultValue={product?.brand ?? "NewEra"} name="brand" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.category}</span>
          <CustomSelect
            defaultValue={product?.categoryId ?? categoryOptions[0]?.value}
            name="categoryId"
            options={categoryOptions}
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.gender}</span>
          <CustomSelect
            defaultValue={product?.gender ?? "UNISEX"}
            name="gender"
            options={genderOptions(locale)}
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.status}</span>
          <CustomSelect
            defaultValue={product?.status ?? "ACTIVE"}
            name="status"
            options={productStatusOptions(locale)}
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.sizes}</span>
          <Input defaultValue={product?.sizes.join(", ") ?? "S, M, L"} name="sizes" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.colors}</span>
          <Input defaultValue={product?.colors.join(", ") ?? "Sky, White"} name="colors" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.percentDiscount}</span>
          <Input
            defaultValue={product?.discountPercent ?? ""}
            min="0"
            name="discountPercent"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.discountValue}</span>
          <Input
            defaultValue={toInput(product?.discountValue)}
            min="0"
            name="discountValue"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium lg:col-span-3">
          <span>{text.description}</span>
          <Textarea defaultValue={product?.description} name="description" required />
        </label>
        <label className="block space-y-2 text-sm font-medium lg:col-span-3">
          <span>{text.composition}</span>
          <Textarea defaultValue={product?.composition ?? ""} name="composition" />
        </label>
        <label className="block space-y-2 text-sm font-medium lg:col-span-3">
          <span>{text.delivery}</span>
          <Textarea defaultValue={product?.deliveryInfo ?? ""} name="deliveryInfo" />
        </label>
        <label className="block space-y-2 text-sm font-medium lg:col-span-3">
          <span>{text.gallery}</span>
          <Textarea defaultValue={product?.galleryUrls.join("\n") ?? ""} name="galleryUrls" />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <CheckboxField
          defaultChecked={product?.inStock ?? true}
          label={text.inStock}
          name="inStock"
        />
        <CheckboxField
          defaultChecked={product?.isFeatured ?? false}
          label={text.featured}
          name="isFeatured"
        />
        <CheckboxField defaultChecked={product?.isNew ?? false} label={text.new} name="isNew" />
        <CheckboxField
          defaultChecked={product?.isPopular ?? false}
          label={text.popular}
          name="isPopular"
        />
        <CheckboxField
          defaultChecked={product?.isDiscounted ?? false}
          label={text.sale}
          name="isDiscounted"
        />
        <Button className="ml-auto" disabled={categories.length === 0} type="submit">
          {product ? (
            <Save aria-hidden="true" className="h-4 w-4" />
          ) : (
            <PackagePlus aria-hidden="true" className="h-4 w-4" />
          )}
          {product ? text.save : text.create}
        </Button>
      </div>
    </form>
  );
}

function PromoCodeForm({ locale, promoCode }: { locale: Locale; promoCode?: AdminPromoCode }) {
  const text = copy[locale];
  const action = promoCode
    ? updatePromoCodeAction.bind(null, locale, promoCode.id)
    : createPromoCodeAction.bind(null, locale);

  return (
    <form action={action} className="rounded-lg border border-border bg-white p-5">
      <div className="grid gap-4 lg:grid-cols-4">
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.promoCode}</span>
          <Input defaultValue={promoCode?.code} name="code" placeholder="NEWERA10" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.discountType}</span>
          <CustomSelect
            defaultValue={promoCode?.discountType ?? "PERCENT"}
            name="discountType"
            options={discountTypeOptions(locale)}
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.discountValue}</span>
          <Input
            defaultValue={toInput(promoCode?.discountValue)}
            min="0"
            name="discountValue"
            required
            step="0.01"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.minimumOrder}</span>
          <Input
            defaultValue={toInput(promoCode?.minimumOrderAmount)}
            min="0"
            name="minimumOrderAmount"
            step="0.01"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.maxDiscount}</span>
          <Input
            defaultValue={toInput(promoCode?.maxDiscountAmount)}
            min="0"
            name="maxDiscountAmount"
            step="0.01"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.usageLimit}</span>
          <Input
            defaultValue={promoCode?.usageLimit ?? ""}
            min="0"
            name="usageLimit"
            type="number"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.startsAt}</span>
          <Input
            defaultValue={toDateInput(promoCode?.startsAt ?? null)}
            name="startsAt"
            type="date"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{text.expiresAt}</span>
          <Input
            defaultValue={toDateInput(promoCode?.expiresAt ?? null)}
            name="expiresAt"
            type="date"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium lg:col-span-4">
          <span>{text.description}</span>
          <Textarea defaultValue={promoCode?.description ?? ""} name="description" />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <CheckboxField
          defaultChecked={promoCode?.isActive ?? true}
          label={text.active}
          name="isActive"
        />
        {promoCode ? (
          <span className="text-sm text-muted-foreground">
            {text.used}: {promoCode.usedCount}
            {promoCode.usageLimit ? ` / ${promoCode.usageLimit}` : ""}
          </span>
        ) : null}
        <Button type="submit" variant={promoCode ? "outline" : "primary"}>
          {promoCode ? (
            <Save aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Plus aria-hidden="true" className="h-4 w-4" />
          )}
          {promoCode ? text.save : text.create}
        </Button>
      </div>
    </form>
  );
}

function OrdersPanel({ locale, orders }: { locale: Locale; orders: AdminOrder[] }) {
  const text = copy[locale];

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-sm text-muted-foreground">
        {text.noOrders}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article className="rounded-lg border border-border bg-white p-5" key={order.id}>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.customerName} · {order.customerPhone} · {order.customerAddress}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {text.payment}: {order.paymentStatus} · {text.status}: {order.orderStatus}
              </p>
            </div>
            <p className="text-xl font-semibold">
              {formatMoney(Number(order.totalAmount), locale)}
            </p>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {order.items.map((item) => (
              <p key={item.id}>
                {item.productName} · {item.quantity} · {formatMoney(Number(item.lineTotal), locale)}
              </p>
            ))}
          </div>
          <form
            action={updateOrderStatusAction.bind(null, locale, order.id)}
            className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <CustomSelect
              defaultValue={order.paymentStatus}
              name="paymentStatus"
              options={paymentStatusOptions(locale)}
            />
            <CustomSelect
              defaultValue={order.orderStatus}
              name="orderStatus"
              options={orderStatusOptions(locale)}
            />
            <Button type="submit" variant="outline">
              <Pencil aria-hidden="true" className="h-4 w-4" />
              {text.save}
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            <form action={setOrderPaymentAction.bind(null, locale, order.id, "CONFIRMED")}>
              <Button size="sm" type="submit">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                {text.confirmPayment}
              </Button>
            </form>
            <form action={setOrderPaymentAction.bind(null, locale, order.id, "REJECTED")}>
              <Button size="sm" type="submit" variant="outline">
                <XCircle aria-hidden="true" className="h-4 w-4" />
                {text.rejectPayment}
              </Button>
            </form>
            <form action={setOrderStatusAction.bind(null, locale, order.id, "PROCESSING")}>
              <Button size="sm" type="submit" variant="secondary">
                <PackageCheck aria-hidden="true" className="h-4 w-4" />
                {text.processing}
              </Button>
            </form>
            <form action={setOrderStatusAction.bind(null, locale, order.id, "SHIPPED")}>
              <Button size="sm" type="submit" variant="secondary">
                <Send aria-hidden="true" className="h-4 w-4" />
                {text.shipped}
              </Button>
            </form>
            <form action={setOrderStatusAction.bind(null, locale, order.id, "COMPLETED")}>
              <Button size="sm" type="submit" variant="secondary">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                {text.completed}
              </Button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

export function AdminDashboard({ data, locale, status }: AdminDashboardProps) {
  const text = copy[locale];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            {text.admin}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{text.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {text.subtitle}
          </p>
        </div>
      </div>

      <StatusBanner locale={locale} status={status} />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Metric label={text.products} value={String(data.stats.productCount)} />
        <Metric label={text.categories} value={String(data.stats.categoryCount)} />
        <Metric label={text.orders} value={String(data.stats.orderCount)} />
        <Metric label={text.promoCodes} value={String(data.stats.promoCodeCount)} />
        <Metric label={text.users} value={String(data.stats.userCount)} />
        <Metric label={text.total} value={formatMoney(data.stats.revenue, locale)} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">{text.createCategory}</h2>
          <CategoryForm locale={locale} />
          <div className="mt-5 space-y-4">
            {data.categories.map((category) => (
              <div key={category.id} className="space-y-3">
                <CategoryForm category={category} locale={locale} />
                <form
                  action={deleteCategoryAction.bind(null, locale, category.id)}
                  className="text-right"
                >
                  <Button size="sm" type="submit" variant="outline">
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    {text.delete}
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">{text.createProduct}</h2>
          <ProductForm categories={data.categories} locale={locale} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">{text.products}</h2>
        {data.products.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-8 text-sm text-muted-foreground">
            {text.noProducts}
          </div>
        ) : (
          <div className="space-y-5">
            {data.products.map((product) => (
              <article className="space-y-3" key={product.id}>
                <ProductForm categories={data.categories} locale={locale} product={product} />
                <form
                  action={deleteProductAction.bind(null, locale, product.id)}
                  className="text-right"
                >
                  <Button size="sm" type="submit" variant="outline">
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    {text.delete}
                  </Button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">{text.promoCodes}</h2>
        <div className="space-y-5">
          <PromoCodeForm locale={locale} />
          {data.promoCodes.length === 0 ? (
            <div className="rounded-lg border border-border bg-white p-8 text-sm text-muted-foreground">
              {text.noPromoCodes}
            </div>
          ) : (
            data.promoCodes.map((promoCode) => (
              <article className="space-y-3" key={promoCode.id}>
                <PromoCodeForm locale={locale} promoCode={promoCode} />
                <form
                  action={deletePromoCodeAction.bind(null, locale, promoCode.id)}
                  className="text-right"
                >
                  <Button size="sm" type="submit" variant="outline">
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    {text.delete}
                  </Button>
                </form>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">{text.orders}</h2>
        <OrdersPanel locale={locale} orders={data.orders} />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">{text.users}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.users.map((user) => (
            <article className="rounded-lg border border-border bg-white p-5" key={user.id}>
              <p className="font-semibold">{user.login}</p>
              <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                {user.role === "ADMIN" ? (
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
                ) : (
                  <CircleSlash aria-hidden="true" className="h-4 w-4" />
                )}
                {user.role} · {text.orders}: {user._count.orders}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

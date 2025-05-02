import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import Header from '@/components/layout/Header'; // Убедитесь, что путь правильный
import Footer from '@/components/layout/Footer'; // Убедитесь, что путь правильный
import { Button } from '@/components/ui/button'; // Убедитесь, что путь правильный
import { Input } from '@/components/ui/input'; // Убедитесь, что путь правильный
import { Textarea } from '@/components/ui/textarea'; // Убедитесь, что путь правильный
import { Label } from '@/components/ui/label'; // Убедитесь, что путь правильный
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Убедитесь, что путь правильный
import { useToast } from '@/hooks/use-toast'; // Убедитесь, что путь правильный
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'; // Убедитесь, что путь правильный

// Определяем схему формы с помощью Zod для валидации
const providerFormSchema = z.object({
  name: z.string().min(1, { message: 'forProviders.validation.nameRequired' }),
  description: z.string().min(10, { message: 'forProviders.validation.descriptionMinLength' }),
  category: z.enum(['Customer Support', 'Sales', 'Marketing', 'Developer Tools', 'Other'], { required_error: 'forProviders.validation.categoryRequired' }),
  price: z.number().positive({ message: 'forProviders.validation.pricePositive' }),
  priceModel: z.enum(['Per request', 'Per hour', 'Subscription'], { required_error: 'forProviders.validation.priceModelRequired' }),
  imageUrl: z.string().url({ message: 'forProviders.validation.imageUrlInvalid' }).optional().or(z.literal('')), // Разрешаем пустую строку или валидный URL
  provider: z.string().min(1, { message: 'forProviders.validation.providerRequired' }),
});

type ProviderFormData = z.infer<typeof providerFormSchema>;

const ForProviders = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Other', // Установите допустимое значение enum по умолчанию
      price: 0.0,
      priceModel: 'Per request', // Установите допустимое значение enum по умолчанию
      imageUrl: '',
      provider: '',
    }
  });

  const onSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby8jr-hHKKsY5lwKPmWz6UgRK7e7ur0oJxZ3dOHwDOOBjGufpmHBWvSCNaBObZTZ9eO/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.result === 'success') { // Предполагая, что ваш скрипт возвращает { result: 'success' }
        toast({
          title: t('forProviders.submissionSuccessTitle'),
          description: t('forProviders.submissionSuccessDesc'),
        });
        form.reset(); // Сбросить поля формы после успешной отправки
      } else {
        // Обработка потенциальных ошибок, возвращаемых скриптом, или ответов не-2xx
        toast({
          title: t('forProviders.submissionErrorTitle'),
          description: result.message || t('forProviders.submissionErrorDesc'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        title: t('forProviders.submissionNetworkErrorTitle'),
        description: t('forProviders.submissionNetworkErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('forProviders.title')}</h1>
          <p className="text-center text-gray-600 mb-10">{t('forProviders.description')}</p>

          <Form {...form}> {/* Обертка Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* Используем form.handleSubmit */}
              {/* Agent Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                  <Label htmlFor="name">{t('forProviders.agentNameLabel')}</Label>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder={t('forProviders.agentNamePlaceholder')}
                      {...field}
                      className={form.formState.errors.name ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  {form.formState.errors.name && <FormMessage>{t(form.formState.errors.name.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="description">{t('forProviders.descriptionLabel')}</Label>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder={t('forProviders.descriptionPlaceholder')}
                      {...field}
                      className={form.formState.errors.description ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  {form.formState.errors.description && <FormMessage>{t(form.formState.errors.description.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="category">{t('forProviders.categoryLabel')}</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                    <FormControl>
                      <SelectTrigger id="category" className={form.formState.errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('forProviders.categoryPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Customer Support">{t('categories.customerSupport')}</SelectItem>
                      <SelectItem value="Sales">{t('categories.sales')}</SelectItem>
                      <SelectItem value="Marketing">{t('categories.marketing')}</SelectItem>
                      <SelectItem value="Developer Tools">{t('categories.developerTools')}</SelectItem>
                      <SelectItem value="Other">{t('categories.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && <FormMessage>{t(form.formState.errors.category.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="price">{t('forProviders.priceLabel')}</Label>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder={t('forProviders.pricePlaceholder')}
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)} // Убедимся, что значение является числом
                      className={form.formState.errors.price ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  {form.formState.errors.price && <FormMessage>{t(form.formState.errors.price.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            {/* Price Model */}
            <FormField
              control={form.control}
              name="priceModel"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="priceModel">{t('forProviders.priceModelLabel')}</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                    <FormControl>
                      <SelectTrigger id="priceModel" className={form.formState.errors.priceModel ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('forProviders.priceModelPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Per request">{t('priceModels.perRequest')}</SelectItem>
                      <SelectItem value="Per hour">{t('priceModels.perHour')}</SelectItem>
                      <SelectItem value="Subscription">{t('priceModels.subscription')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.priceModel && <FormMessage>{t(form.formState.errors.priceModel.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="imageUrl">{t('forProviders.imageUrlLabel')}</Label>
                  <FormControl>
                    <Input
                      id="imageUrl"
                      placeholder={t('forProviders.imageUrlPlaceholder')}
                      {...field}
                      className={form.formState.errors.imageUrl ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  {form.formState.errors.imageUrl && <FormMessage>{t(form.formState.errors.imageUrl.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            {/* Provider Name */}
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="provider">{t('forProviders.providerNameLabel')}</Label>
                  <FormControl>
                    <Input
                      id="provider"
                      placeholder={t('forProviders.providerNamePlaceholder')}
                      {...field}
                      className={form.formState.errors.provider ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  {form.formState.errors.provider && <FormMessage>{t(form.formState.errors.provider.message as string)}</FormMessage>} {/* Добавлен 'as string' для t */}
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? t('forProviders.submitting') : t('forProviders.submitButton')}
            </Button>
          </form>
        </Form> {/* Закрытие обертки Form */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForProviders;
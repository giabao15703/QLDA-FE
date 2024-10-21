import { FormComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { FormService } from '#shared/services';
import { E_FieldAppearance, E_FieldType } from '#shared/types';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface InputGroup {
    title?: string;
    productServiceName: string;
    numberOfOders: string;
    actualQuantityReceived: string;
    unit: string;
    deliveryDate: string;
    receivedDate: string;
}

@Component({
    standalone: true,
    selector: 'nextpro-user-complaints-refunds-supplier',
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.scss',
    providers: [FormService],
    imports: [CommonModule, FormsModule, FormComponent, MaterialModules, TranslateModule],
})
export class ComplainsRefundsSupplierComponent {
    constructor(
        public explainForm: FormService,
        public opinionForm: FormService,
        public feedbackForm: FormService,
    ) {
        explainForm.config = [
            {
                class: 'mt-2 w-full min-h-32',
                name: 'opinion',
                fieldType: E_FieldType.TEXTAREA,
            },
        ];
        opinionForm.config = [
            {
                class: 'mt-2 w-full min-h-32',
                name: 'responseSupplier',
                fieldType: E_FieldType.TEXTAREA,
            },
        ];
        feedbackForm.config = [
            {
                name: 'feedbackGroupContainer',
                fieldType: E_FieldType.CONTAINER,
                children: [
                    {
                        name: 'feebackSelection',
                        class: 'flex mt-2 lg:flex-row flex-col lg:items-center lg:gap-x-32',
                        fieldType: E_FieldType.RADIO,
                        appearance: E_FieldAppearance.FILL,
                        options: [
                            {
                                label: 'customer-support.accept-complaints',
                                value: 'acceptComplaints',
                            },
                            {
                                label: 'customer-support.reject-complaints',
                                value: 'rejectComplaints',
                            },
                        ],
                    },
                ],
            },
        ];
    }

    @ViewChildren('imageUpload') imageUploads: QueryList<ElementRef>;

    images = [{ url: null }];
    isTermAccept = false;
    previewUrl: string | null = null;
    previewImageUrl: string | null = null;
    isImageModalOpen: boolean = false;
    elementRef;
    orderInfo = [
        {
            id: 0,
            productCode: 123456789,
            description:
                'Chúng tôi chuyên cung cấp thiết bị điều khiển tắt/ mở từ xa bằng remote (hoặc trên smartphone ) công nghệ mới, học được lệnh tắt mở tất cả các remote có tần số 315~433MHz,hoặc bằng sóng hồng ngoai (tv,quạt,máy lạnh...) và hẹn được giờ tắt theo ý muốn.',
            receivedDate: '30/05/2023',
            receivedTime: '10:00',
            status: 'Đã giao',
            totalPrice: 5000000,
        },
    ];

    inputGroups: InputGroup[] = [
        {
            title: 'Sản phẩm 1',
            productServiceName: '',
            numberOfOders: '',
            actualQuantityReceived: '',
            unit: '',
            deliveryDate: '',
            receivedDate: '',
        },
    ];

    addInputGroup(): void {
        if (this.inputGroups.length < 2) {
            this.inputGroups.push({
                title: `Sản phẩm ${this.inputGroups.length + 1}`,
                productServiceName: '',
                numberOfOders: '',
                actualQuantityReceived: '',
                unit: '',
                deliveryDate: '',
                receivedDate: '',
            });
        } else {
            console.log('Thêm tối đa 2 sản phẩm.');
        }
    }

    videoChanged(event: Event): void {
        const element = event.currentTarget as HTMLInputElement;
        const file: File | null = element.files ? element.files[0] : null;

        if (file) {
            this.previewUrl = URL.createObjectURL(file);
        }
    }

    removeVideo(event: Event): void {
        event.stopPropagation();
        this.previewUrl = null;
        const input = document.getElementById('videoUpload') as HTMLInputElement;
        if (input) input.value = '';
    }

    addNewImage(): void {
        if (this.images.length < 5) {
            this.images.push({ url: null });
        } else {
            alert('Bạn chỉ có thể thêm tối đa 5 hình ảnh.');
        }
    }

    imageChanged(event: Event, index: number): void {
        const element = event.currentTarget as HTMLInputElement;
        const file: File | null = element.files ? element.files[0] : null;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.images[index].url = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    openImageModal(): void {
        this.isImageModalOpen = true;
    }

    closeImageModal(): void {
        this.isImageModalOpen = false;
    }

    removeImage(index: number): void {
        if (index > -1 && index < this.images.length) {
            this.images[index].url = null;

            if (this.imageUploads && this.imageUploads.toArray()[index]) {
                this.imageUploads.toArray()[index].nativeElement.value = '';
            }
        }
    }

    onIsTermAcceptChange = (event) => {
        this.isTermAccept = event.checked;
    };
}

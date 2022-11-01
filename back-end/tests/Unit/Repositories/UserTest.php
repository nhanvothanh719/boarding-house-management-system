<?php

namespace Tests\Unit\Repositories;

use App\Models\User;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\ServiceRegistration;
use App\Models\Breach;
use App\Models\BreachHistory;

use Tests\TestCase;

use \stdClass;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

use Faker\Factory as Faker;

use App\Repositories\User\UserRepository;

class UserTest extends TestCase
{
    protected $user;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $this->user = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // password
            'remember_token' => Str::random(10),
            'gender' => random_int(0, 1),
            'date_of_birth' => date('Y-m-d', strtotime(' -20 year')),
            'id_card_number' => $this->faker->unique()->numerify('##########'),
            'phone_number' => $this->faker->unique()->numerify('##########'),
            'occupation' => 'test data',
            'permanent_address' => $this->faker->address(),
            'role' => rand(0, 1),
        ];
        $this->user_repository = new UserRepository();
    }

    public function test_all() {
        $all_users = $this->user_repository->all();
        $this->assertDatabaseCount('users', count($all_users));
    }

    public function test_store() {
        $password = 'password';
        $avatar = null;
        $user = $this->user_repository->store($this->user, $password, $avatar);
        $this->assertInstanceOf(User::class, $user);
    }

    public function test_show() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $found_user = $this->user_repository->show($user->id);
        $this->assertInstanceOf(User::class, $found_user);
        $this->assertEquals($found_user->name, $user->name);
        $this->assertEquals($found_user->email, $user->email);
    }

    public function test_update() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $new_user = $this->user_repository->update($this->user, $user->id);
        $this->assertEquals($new_user->name, $this->user['name']);
        $this->assertEquals($new_user->email, $this->user['email']);
        $this->assertEquals($new_user->date_of_birth, $this->user['date_of_birth']);
        $this->assertEquals($new_user->phone_number, $this->user['phone_number']);
        $this->assertEquals($new_user->occupation, $this->user['occupation']);
        $this->assertEquals($new_user->permanent_address, $this->user['permanent_address']);
    }

    public function test_delete() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $delete_user = $this->user_repository->delete($user->id);
        $this->assertTrue($delete_user);
        $this->assertDatabaseMissing('users', $user->toArray());
    }

    public function test_check_can_login() {
        $user = User::factory()->create(['email' => 'testemail@gmail.com', 'occupation' => 'test data']);
        $input_for_login = array();
        $input_for_login['email'] = $user->email;
        $input_for_login['password'] = 'password';
        $this->assertTrue($this->user_repository->checkCanLogin($input_for_login));
        $input_for_fail_login = array();
        $input_for_login['email'] = $user->email;
        $input_for_login['password'] = 'password123';
        $this->assertFalse($this->user_repository->checkCanLogin($input_for_fail_login));
    }

    public function test_check_locked_account() {
        $locked_user = User::factory()->create(['is_locked' => User::LOCKED_ACCOUNT, 'occupation' => 'test data']);
        $unlocked_user = User::factory()->create(['is_locked' => User::AVAILABLE_ACCOUNT, 'occupation' => 'test data']);
        $this->assertTrue($this->user_repository->checkLockedAccount($locked_user->id));
        $this->assertFalse($this->user_repository->checkLockedAccount($unlocked_user->id));
    }

    public function test_check_admin_role() {
        $user = User::factory()->create(['role' => User::ROLE_ADMIN, 'occupation' => 'test data']);
        $this->assertTrue($this->user_repository->checkAdmin($user->id));
    }

    public function test_lock_user_account() {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'occupation' => 'test data']);
        $this->assertFalse($this->user_repository->lockUserAccount($admin->id));
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->assertTrue($this->user_repository->lockUserAccount($renter->id));
    }

    public function test_update_password() {
        $old_hashed_password = Hash::make('password');
        $new_hashed_password = Hash::make('newpassword');
        $user = User::factory()->create(['email' => 'passwordtestemail@gmail.com', 'occupation' => 'test data', 'password' => $old_hashed_password]);
        $updated_password_user = $this->user_repository->updatePassword($user->email, $new_hashed_password);
        $this->assertInstanceOf(User::class, $updated_password_user);
        $this->assertEquals($updated_password_user->password, $new_hashed_password);
    }

    public function test_get_renter_breach_histories() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); //role renter
        $breach = Breach::factory()->create(['description' => 'test data']);
        $all_breach_histories = array();
        $first_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s', strtotime(' -1 hours'))]);
        array_push($all_breach_histories, $first_breach_history);
        $second_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s')]);
        array_push($all_breach_histories, $second_breach_history);
        $renter_breach_histories = $this->user_repository->getBreachHistories($renter->id);
        $this->assertSameSize($renter_breach_histories, $all_breach_histories);
    }

    public function test_get_registered_services() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); 
        $first_service = Service::factory()->create(['description' => 'test data']);
        $second_service = Service::factory()->create(['description' => 'test data']);
        $first_service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $first_service->id]);
        $first_service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $second_service->id]);
        $this->assertEquals(count($this->user_repository->getRegisteredServices($renter->id)), 2);
    }

    public function test_get_renter_invoices() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $first_invoice = Invoice::factory()->create(['renter_id' => $renter->id, 'month' => 3]);
        $second_invoice = Invoice::factory()->create(['renter_id' => $renter->id, 'month' => 4]);
        $this->assertEquals(count($this->user_repository->getRenterInvoices($renter->id)), 2);
    }

    public function test_get_all_renters() {
        $first_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $second_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $third_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->assertEquals(count($this->user_repository->getAllRenters()), 3);
    }

    public function test_update_important_information() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $new_user = $this->user_repository->updateImportantInfo($this->user, $user->id);
        $this->assertEquals($new_user->gender, $this->user['gender']);
        $this->assertEquals($new_user->id_card_number, $this->user['id_card_number']);
        $this->assertEquals($new_user->role, $this->user['role']);
    }

    public function test_count_renters() {
        $first_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $second_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $third_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->assertEquals($this->user_repository->countRenters(), 3);
    }

    public function test_send_announcement_to_existed_renters() {
        $test_data = array();
        $test_data['title'] = 'Test announcement mail';
        $test_data['content'] = 'Content of test announcement mail';
        $first_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'email' => 'testannoucement1@gmail.com']);
        $second_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'email' => 'testannoucement2@gmail.com']);
        $all_id = array();
        array_push($all_id, $first_renter->id);
        array_push($all_id, $second_renter->id);
        $test_data['all_id'] = $all_id;
        $this->assertTrue($this->user_repository->sendAnnouncement($test_data));
    }

    public function test_send_announcement_to_not_existed_renters() {
        $test_data = array();
        $test_data['title'] = 'Test announcement mail';
        $test_data['content'] = 'Content of test announcement mail';
        $first_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'email' => 'testannoucement1@gmail.com']);
        $second_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'email' => 'testannoucement2@gmail.com']);
        User::where('email', 'testannoucement2@gmail.com')->delete();
        $all_id = array();
        array_push($all_id, $first_renter->id);
        array_push($all_id, $second_renter->id);
        $test_data['all_id'] = $all_id;
        $this->assertFalse($this->user_repository->sendAnnouncement($test_data));
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('role', User::ROLE_RENTER)->where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            Invoice::where('renter_id', $renter_id)->delete();
            BreachHistory::where('renter_id', $renter_id)->delete();
            ServiceRegistration::where('user_id', $renter_id)->delete();
        }
        Breach::where('description', 'test data')->delete();
        Service::where('description', 'test data')->delete();
        User::where('occupation', 'test data')->delete();
        parent::tearDown();
    }
}
